// import {getPivotData} from 'models/report/Item';

const {getPivotData} = require('models/' +
  'report/Item');
/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} param 데이터 조회할 때 사용할 파라미터터
 */
const generateItem = (item, param) => {
  const getField = (f, area, expanded) => {
    return {
      caption: f.caption,
      dataField: f.name,
      area: area,
      expanded: expanded
    };
  };

  const dataField = item.meta.dataField;
  const rows = dataField.row.map((r, i) => {
    return getField(r, 'column', dataField.row.length - 1 != i);
  });
  const columns = dataField.column.map((r, i) => {
    return getField(r, 'row', dataField.column.length - 1 != i);
  });
  const datas = dataField.measure.map((r, i) => {
    const temp = getField(r, 'data', dataField.column.length - 1 != i);
    temp.summaryType = r.summaryType;
    return temp;
  });

  const fields = rows.concat(columns).concat(datas);
  let matrixInfo;

  const dataSourceConfig = {
    remoteOperations: true,
    load: (loadOptions) => {
      const promise = new Promise(async (resolve, reject) => {
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
        } else {
          // 추후 정렬 기준 항목 추가시 주석 해제
          // if (loadOptions.totalSummary &&
          //     loadOptions.totalSummary.length > 0) {
          //   loadOptions.totalSummary =
          //       loadOptions.totalSummary.concat(hiddenFields);
          // }
          // if (loadOptions.groupSummary &&
          //     loadOptions.groupSummary.length > 0) {
          //   loadOptions.groupSummary =
          //       loadOptions.groupSummary.concat(hiddenFields);
          // }

          if (loadOptions.group) {
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
                for (let j = 0; j < dataField.row.length; j++) {
                  if (loadOptions.group[i].selector == dataField.row[j].name) {
                    isColumn = true;
                    break;
                  }
                }
                // row랑 col 내용 바뀌어있음.
                // 행열 변환 추가시 주석 해제
                // if (isColumn == (self.meta.ColRowSwitch ? true : false)) {
                if (isColumn) {
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
                const makeTreeData = (arr, curColDepth, maxColDepth,
                    curRowDepth, maxRowDepth, parentKey, rowIdx) => {
                  const cells = matrixInfo.matrix.cells;
                  const meta = matrixInfo.matrix;

                  if (curRowDepth <= maxRowDepth) {
                    meta.rowFlattendSummaryDimensions.map((dim, i) => {
                      if (dim.depth == curRowDepth &&
                          (dim.path.split('~|_').indexOf(parentKey) > -1 ||
                          !parentKey)) {
                        let items = [];
                        const summary = [];
                        if (curRowDepth < maxRowDepth || maxRowDepth > 0) {
                          makeTreeData(items, curColDepth, maxColDepth,
                              curRowDepth + 1, maxRowDepth, dim.key, i);
                        }
                        if (items.length == 0) {
                          items = null;
                        }

                        cells[i][0].vs.map((cell, j) => {
                          summary.push(cell.s || cell.v || cell.c);
                        });

                        arr.push({
                          key: dim.key, summary: summary, items: items
                        });
                      }
                    });
                  } else if (curColDepth <= maxColDepth) {
                    meta.colFlattendSummaryDimensions.map((dim, i) => {
                      if (dim.depth == curColDepth &&
                          (dim.path.split('~|_').indexOf(parentKey) > -1 ||
                          !parentKey || curColDepth == 1)) {
                        let items = [];
                        const summary = [];
                        if (curColDepth < maxColDepth) {
                          makeTreeData(items, curColDepth + 1, maxColDepth,
                              curRowDepth, maxRowDepth, dim.key, rowIdx);
                        }
                        if (items.length == 0) {
                          items = null;
                        }

                        cells[rowIdx][i].vs.map((cell, j) => {
                          summary.push(cell.s || cell.v || cell.c);
                        });

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
              const parameter = {
                // Pass if the remoteOperations option is set to true
                take: loadOptions.take,
                skip: loadOptions.skip,
                group: loadOptions.group ?
                  JSON.stringify(loadOptions.group) : '',
                filter: loadOptions.filter ?
                  JSON.stringify(loadOptions.filter) : '',
                totalSummary: loadOptions.totalSummary ?
                  JSON.stringify(loadOptions.totalSummary) : '',
                groupSummary: loadOptions.groupSummary ?
                  JSON.stringify(loadOptions.groupSummary) : '',
                udfGroups: JSON.stringify([]),
                // topBottom: JSON.stringify({}),
                ...param
              };

              const result = await getPivotData(parameter);

              matrixInfo = result.data;

              const tempResult = makeDataByMatrix();
              resolve(tempResult);
            } else {
              const matrixLoadWaitFunc = setInterval(function() {
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
          }
        }
      });
      return promise;
    },
    fields: fields
  };

  item.mart.dataSourceConfig = dataSourceConfig;
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.column.concat(dataField.row);
  param.measure = dataField.measure;

  param.paging = {
    pagingEnabled: false,
    offset: 10,
    limit: 10,
    rowGroups: dataField.column.map((data) => {
      return {selector: data.name};
    })
  };

  param.sortInfo = param.dimension.map((dim) => {
    return {
      sortOrder: 'asc',
      dataField: dim.name,
      sortByField: dim.name
    };
  });
  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
  param.sortInfo = JSON.stringify(param.sortInfo);
  param.paging = JSON.stringify(param.paging);
};

export default {
  generateItem,
  generateParameter
};
