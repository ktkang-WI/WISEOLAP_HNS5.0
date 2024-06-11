import {setMeta} from '../util/metaUtilityFactory';
import {defaultDimension, defaultMeasure}
  from 'components/report/item/util/martUtilityFactory';
import localizedString from 'config/localization';
import {DataFieldType} from '../util/dataFieldType';
import chartSeriesButtonIcon from 'assets/image/icon/item/bar.png';
import columnIcon from 'assets/image/icon/dataSource/column.png';
import rowIcon from 'assets/image/icon/dataSource/row.png';
import {DesignerMode} from 'components/config/configType';
import {getItemData} from 'models/report/Item';
import ItemType from '../util/ItemType';
import store from 'redux/modules';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItems} from 'redux/selector/ItemSelector';

const cache = new Map();

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  setMeta(item, 'positionOption', {
    column: {
      totalVisible: true, // 열 합계 표시
      grandTotalVisible: true, // 열 총 합계 표시
      position: 'left', // 열 합계 위치
      expand: true // 열 그룹 확장(초기상태)
    },
    row: {
      totalVisible: true, // 행 합계 표시
      grandTotalVisible: true, // 행 총 합계 표시
      position: 'top', // 행 합계 위치
      expand: true // 행 그룹 확장(초기상태)
    },
    dataPosition: 'row' // 측정값 위치
  });
  setMeta(item, 'layout', 'standard');
  setMeta(item, 'autoSize', false);
  setMeta(item, 'removeNullData', false);
  setMeta(item, 'showFilter', false);
  setMeta(item, 'colRowSwitch', false);
  setMeta(item, 'dataHighlight', []);
  setMeta(item, 'pagingOption', {
    pagination: {
      isOk: false,
      content: '',
      pagingRange: 20,
      index: 1
    },
    pageUsageOfPageCount: {
      isOk: false,
      pageSizes: [10, 20, 50]
    }
  });
};

const gridAttributeOptionCheck = (dataFieldName, gridAttribute) => {
  const noGridAttribute = !gridAttribute;
  const noFieldInGridAttribute = !gridAttribute?.[dataFieldName];
  const fieldIsVisible = gridAttribute?.[dataFieldName]?.gridVisibility;

  return noGridAttribute || noFieldInGridAttribute || fieldIsVisible;
};
/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} param 아이템 조회 파라미터
 * @param {*} rootItem rootItem
 */
const generateItem = (item, param, rootItem) => {
  const fields = [];
  const dataField = item.meta.dataField || rootItem.adHocOption.dataField;

  const {updateItem} = ItemSlice.actions;
  const gridAttribute = rootItem?.adHocOption?.gridAttribute;
  const variationValues = rootItem?.adHocOption?.variationValues || [];
  const reportId = selectCurrentReportId(store.getState());
  const allMeasure = dataField.measure.concat(dataField.sortByItem);
  const getMeasureByFieldId = allMeasure.reduce((acc, data) => {
    acc[data.fieldId] = data;
    return acc;
  }, {});

  for (const field of dataField.measure) {
    const dataFieldName = field.summaryType + '_' + field.name;
    if (!gridAttributeOptionCheck(dataFieldName, gridAttribute)) continue;
    fields.push({
      caption: field.caption,
      summaryType: 'SUM',
      dataField: dataFieldName,
      area: 'data'
    });
  }

  for (const field of dataField.sortByItem) {
    const dataFieldName = field.summaryType + '_' + field.name;
    if (!gridAttributeOptionCheck(dataFieldName, gridAttribute)) continue;
    fields.push({
      caption: field.caption,
      summaryType: 'SUM',
      dataField: dataFieldName,
      area: 'data',
      visible: false
    });
  }

  for (const field of dataField.row) {
    const dataFieldName = field.name;
    if (!gridAttributeOptionCheck(dataFieldName, gridAttribute)) continue;
    fields.push({
      caption: field.caption,
      dataField: dataFieldName,
      area: item.meta.colRowSwitch? 'column' : 'row',
      sortBy: 'none',
      expanded: !item.meta.positionOption.row.expand ?
        true :item.meta.positionOption.row.expand
    });
  }

  for (const field of dataField.column) {
    const dataFieldName = field.name;
    if (!gridAttributeOptionCheck(dataFieldName, gridAttribute)) continue;
    let sortBy = {};

    if (field.sortBy && field.sortBy != field.fieldId) {
      const target = getMeasureByFieldId[field.sortBy];

      if (target) {
        sortBy = {
          sortBySummaryField: target.summaryType + '_' + target.name
        };
      } else {
        sortBy = {
          sortBy: dataFieldName
        };
      }
    } else {
      sortBy = {
        sortBy: dataFieldName
      };
    }

    fields.push({
      caption: field.caption,
      dataField: dataFieldName,
      area: item.meta.colRowSwitch? 'row' : 'column',
      sortOrder: field.sortOrder.toLowerCase(),
      expanded: !item.meta.positionOption.column.expand ?
          true :item.meta.positionOption.column.expand,
      ...sortBy
    });
  }

  for (const variationValue of variationValues) {
    const targets = [...dataField.measure, ...dataField.sortByItem];
    const target = targets.find((t) => t.fieldId == variationValue.targetId);

    if (!target) continue;

    const field = {
      area: 'data',
      dataField: target.summaryType + '_' + target.name,
      caption: variationValue.name,
      summaryType: 'SUM',
      summaryDisplayMode: variationValue.type
    };

    fields.push(field);
  }

  const rowGroups = dataField.row
      .reduce((acc, r) => {
        if (gridAttributeOptionCheck(r.name, gridAttribute)) {
          acc.push({selector: r.name});
        }
        return acc;
      }, []);

  item.mart.paging = {
    dataLength: 0,
    size: item.meta.pagingOption.pagination.pagingRange,
    page: item.meta.pagingOption.pagination.index
  };

  queryExcuteCheck = true;

  let matrixInfo;

  const dataSourceConfig = {
    remoteOperations: true,
    load: (loadOptions) => {
      const promise = new Promise(async (resolve, reject) => {
        // 페이징 호출 시 조회를 하지 않더라도 load가 호출되므로
        // item 객체를 갱신시켜 줌
        const items = selectCurrentItems(store.getState());
        const curItem = items.find((i) => i.id == item.id);
        if (loadOptions.take == 20) {
          const takeJson = {};
          // 매트릭스 정보 초기화
          matrixInfo = null;
          fields.map((_fieds, _fieldsIndex) => {
            switch (_fieds.area) {
              case 'row':
                takeJson[_fieds.dataField] = 'text';
                break;
              case 'column':
                takeJson[_fieds.dataField] = 'text';
                break;
              case 'data':
                takeJson[_fieds.dataField] = 123;
                break;
              default:
                takeJson[_fieds.dataField] = 'text';
                break;
            }
          });
          resolve([takeJson]);
          return;
        }

        if (!loadOptions.group) {
          loadOptions.group = [];
        }

        let maxColLength = 0;
        let maxRowLength = 0;
        // group에서 사용되고 있는 컬럼/로우 수
        let curColLength = 0;
        let curRowLength = 0;
        fields.map((field, i) => {
          // if (field.visible) {
          switch (field.area) {
            case 'row': maxRowLength++; break;
            case 'column': maxColLength++; break;
          }
          // }
        });

        const makeDataByMatrix = () => {
          const data = {summary: [], data: []};
          for (let i = 0; i < loadOptions.group.length; i++) {
            let isColumn = false;
            for (let j = 0; j < dataField.column.length; j++) {
              if (loadOptions.group[i].selector ==
                  dataField.column[j].name) {
                isColumn = true;
                break;
              }
            }
            // row랑 col 내용 바뀌어있음.
            // 행열 변환 추가시 주석 해제
            if (isColumn != curItem.meta.colRowSwitch) {
              loadOptions.group[i].area = 'col';
              loadOptions.group[i].index = curColLength;
              curColLength++;
            } else {
              loadOptions.group[i].area = 'row';
              loadOptions.group[i].index = curRowLength;
              curRowLength++;
            }
          }
          // 총계 계산
          if (loadOptions.totalSummary.length > 0) {
            const vs = matrixInfo.matrix.cells[0][0].vs;
            for (let i = 0; i < vs.length; i++) {
              data.summary.push(vs[i].s);
            }
          }
          // 그룹 데이터 계산
          if (loadOptions.group) {
            const tempData = [];
            const addSummary = (cells, summary) => {
              cells.map((cell, j) => {
                const type = cell.t;
                switch (type) {
                  case 'COUNT':
                    summary.push(cell.c);
                    break;
                  case 'COUNTDISTINCT':
                    summary.push(cell.dv.length);
                    break;
                  case 'SUM':
                  case 'CUSTOM':
                    summary.push(cell.s);
                    break;
                  case 'AVG':
                    if (cell.s == 0 && cell.c == 0) {
                      // if (userJsonObject.showNullValue) {
                      //   summary.push(null);
                      // } else {
                      summary.push(0);
                      // }
                    } else if (cell.s == 0 && cell.c > 0) {
                      summary.push(0);
                    } else if (!cell.s) {
                      summary.push(null);
                    } else {
                      summary.push(cell.s / cell.c);
                    }
                    break;
                  case 'MIN':
                  case 'MAX':
                    if (cell.v == 9223372036854776000) {
                      summary.push(0);
                    } else {
                      summary.push(cell.v);
                    }
                    break;
                  default:
                    summary.push(cell.v || cell.s);
                    break;
                }
              });
            };

            const makeTreeData = (arr, curColDepth, maxColDepth,
                curRowDepth, maxRowDepth, parentKey, rowIdx) => {
              const cells = matrixInfo.matrix.cells;
              const meta = matrixInfo.meta;

              if (curRowDepth <= maxRowDepth) {
                meta.rowFlattendSummaryDimensions.map((dim, i) => {
                  if (dim.depth == curRowDepth &&
                    (dim.parentPath == parentKey || !parentKey)) {
                    let items = [];
                    const summary = [];
                    if (curRowDepth < maxRowDepth || maxRowDepth > 0) {
                      makeTreeData(items, curColDepth, maxColDepth,
                          curRowDepth + 1, maxRowDepth, dim.path, i);
                    }
                    if (items.length == 0) {
                      items = null;
                    }

                    addSummary(cells[i][0].vs, summary);

                    arr.push({
                      key: dim.key, summary: summary, items: items
                    });
                  }
                });
              } else if (curColDepth <= maxColDepth) {
                meta.colFlattendSummaryDimensions.map((dim, i) => {
                  if (dim.depth == curColDepth &&
                      (dim.parentPath == parentKey || !parentKey ||
                        curColDepth == 1)) {
                    let items = [];
                    const summary = [];
                    if (curColDepth < maxColDepth) {
                      makeTreeData(items, curColDepth + 1, maxColDepth,
                          curRowDepth, maxRowDepth, dim.path, rowIdx);
                    }
                    if (items.length == 0) {
                      items = null;
                    }
                    addSummary(cells[rowIdx][i].vs, summary);

                    arr.push({
                      key: dim.key, summary: summary, items: items
                    });
                  }
                });
              }
            };
            makeTreeData(tempData, 1, curColLength,
                1, curRowLength, null, 0);
            data.data = tempData;
          }
          return data;
        };
        if (loadOptions.group.length == maxRowLength + maxColLength) {
          const pagingParam = {
            offset: 0,
            limit: 0
          };

          const usePaging = curItem.meta.pagingOption.pagination.isOk;

          const {page, size, dataLength} = curItem.mart.paging;

          if (usePaging) {
            pagingParam.offset = (page - 1) * size;
            pagingParam.limit = size;

            if (dataLength) {
              if (pagingParam.offset > dataLength) {
                const maxPage = Math.ceil(dataLength / size);
                pagingParam.offset = size * (maxPage - 1);
              }
            };
          }

          const parameter = {
            // Pass if the remoteOperations option is set to true
            pivotOption: JSON.stringify({
              take: loadOptions.take,
              skip: loadOptions.skip,
              groupParams: loadOptions.group ||[],
              filterParam: loadOptions.filter || {},
              totalSummaryParams: loadOptions.totalSummary || [],
              groupSummaryParams: loadOptions.groupSummary || [],
              udfGroupsParams: [],
              topBottomParams: [],
              pagingParam: {
                ...pagingParam,
                rowGroupParams: rowGroups
              },
              sortInfoParams: param.sortInfo || []
            }),
            ...param,
            itemType: ItemType.PIVOT_GRID,
            sortInfo: undefined
          };

          const key = JSON.stringify(parameter);

          let res = {};
          if (usePaging) {
            if (cache.has(key)) {
              res = cache.get(key);
            } else {
              res = await getItemData(parameter);
              cache.set(key, res);
            }
          } else {
            res = await getItemData(parameter);
          }


          matrixInfo = res.data.info;

          if (usePaging && dataLength != matrixInfo.paging.total) {
            const tempItem = {
              ...item,
              mart: {
                ...curItem.mart,
                paging: {
                  ...(curItem.mart.paging || {}),
                  dataLength: matrixInfo.paging.total
                }
              }
            };
            store.dispatch(updateItem({reportId, item: tempItem}));
          }
          const tempResult = makeDataByMatrix();
          resolve(tempResult);
        } else {
          const matrixLoadWaitFunc = setInterval(() => {
            const usePaging = curItem.meta.pagingOption.pagination.isOk;

            if (usePaging) {
              const {page, size, dataLength} = curItem.mart.paging;
              let offset = 0;

              offset = (page - 1) * size;

              if (dataLength) {
                if (offset > dataLength) {
                  const maxPage = Math.ceil(dataLength / size);
                  offset = size * (maxPage - 1);
                }

                if (matrixInfo.paging.limit != size ||
                  matrixInfo.paging.offset != offset) {
                  return;
                }
              };
            } else if (matrixInfo?.paging?.limit != 0) {
              return;
            }

            if (matrixInfo) {
              try {
                const result = makeDataByMatrix();
                resolve(result);
                clearInterval(matrixLoadWaitFunc);
              } catch (e) {
                clearInterval(matrixLoadWaitFunc);
              }
            }
          }, 100);
        }
      });
      return promise;
    },
    fields: fields
  };

  item.mart.dataSourceConfig = dataSourceConfig;
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldMeasure = {
    ...defaultMeasure,
    useButton:
    window.location.href.includes(DesignerMode['DASHBOARD'].toLowerCase()) ?
    false : true,
    // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
    buttonIcon: chartSeriesButtonIcon,
    buttonEvent: function(e) {
      console.log(e);
    }
  };

  const dataFieldColumn = {
    ...defaultDimension,
    icon: columnIcon,
    label: localizedString.column,
    placeholder: localizedString.columnPlaceholder
  };

  const dataFieldRow = {
    ...defaultDimension,
    icon: rowIcon,
    label: localizedString.row,
    placeholder: localizedString.rowPlaceholder
  };

  return {
    [DataFieldType.MEASURE]: dataFieldMeasure,
    [DataFieldType.ROW]: dataFieldRow,
    [DataFieldType.COLUMN]: dataFieldColumn
  };
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 * @param {JSON} rootItem 루트 아이템
 */
const generateParameter = (item, param, rootItem) => {
  const dataField = item.meta?.dataField || rootItem.adHocOption.dataField;
  param.dimension = dataField.row.concat(dataField.column);
  param.measure = dataField.measure;
  param.removeNullData = item.meta.removeNullData;

  param.sortInfo = param.dimension.map((dim) => {
    return {
      sortOrder: 'asc',
      dataField: dim.name,
      sortByField: dim.name
    };
  });

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
  param.paging = JSON.stringify(param.paging);
};

/**
 * 리본 영역 아이템 배열을 반환합니다.
 * @return {Array} ribbonItems
 */
const getRibbonItems = () => {
  return [
    'CaptionView',
    'NameEdit',
    'InitState',
    'Total',
    'GrandTotal',
    'Layout',
    'AutoSize',
    'RowTotalPosition',
    'ColumnTotalPosition',
    'DataPosition',
    'RemoveNullData',
    'ShowFilter',
    'Paging',
    'InputTxt'
  ];
};

/**
 * 속셩 영역 아이템 배열을 반환합니다.
 * @return {Array} attributeItems
 */
const getAttributeItems = () => {
  return [
    'InteractionConfiguration',
    'DashAnyPivotOption'
  ];
};

const getTabHeaderItems = () => {
  // TODO: 추후 그리드로 보기 비정형일 때만 보이게 수정해야 함.
  return ['ColRowSwitch', 'ShowGrid'];
};
let queryExcuteCheck = true;
const getExcuteQueryInit = () => {
  return queryExcuteCheck;
};

const setExcuteQueryInit = (checkValue) => {
  queryExcuteCheck = checkValue;
};

export default {
  generateMeta,
  generateItem,
  getDataFieldOptionChild,
  generateParameter,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems,
  getExcuteQueryInit,
  setExcuteQueryInit
};
