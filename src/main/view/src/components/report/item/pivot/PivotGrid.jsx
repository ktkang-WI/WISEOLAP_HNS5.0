import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import React, {useEffect, useRef, useMemo} from 'react';
import {isDataCell, getCssStyle} from './DataHighlightUtility';
import useModal from 'hooks/useModal';
import ShowDataModal
  from 'components/common/atomic/Modal/organisms/ShowDataModal';
import {useSelector} from 'react-redux';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import DetailedDataUtility from './DetailedDataUtility';
import ParamUtils from 'components/dataset/utils/ParamUtils';
import store from 'redux/modules';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import models from 'models';
import localizedString from 'config/localization';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';

const PivotGrid = ({setItemExports, id, adHocOption, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const dataField = adHocOption ? adHocOption.dataField : meta.dataField;

  if (!mart.init) {
    return <></>;
  }

  const ref = useRef();
  const itemExportObject =
   itemExportsObject(id, ref, 'PIVOT', mart.data.data);
  const {openModal} = useModal();

  const datasets = useSelector(selectCurrentDatasets);
  const dataset = datasets.find((ds) =>
    ds.datasetId == dataField.datasetId);
  const detailedData = dataset?.detailedData || [];

  useEffect(() => {
    const item = ref.current;

    if (!item) return;

    const element = item._element;

    // NOTE: Flex-layout 아이템 렌더링 => layout 리사이즈 사이클 이슈 때문에
    // ResizeObserver 추가
    const observer = new ResizeObserver(() => {
      const instance = item.instance;

      if (instance) {
        try {
          instance.updateDimensions();
        } catch {}
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

  // highlight 추가, 변경 시 repaint(컴포넌트를 다시 그려줌)
  useEffect(() => {
    ref.current.instance.repaint();
  }, [meta.dataHighlight]);

  // 하이라이트 목록을 가져옴.
  const highlight = useMemo(() => {
    return meta.dataHighlight;
  }, [meta.dataHighlight]);

  const onCellPrepared = ({cell, area, cellElement}) => {
    if (highlight.length != 0) {
      // isDataCell -> 셀, 합계 셀, 총계 셀 체크에 대한 분기처리
      for (let i = 0; i < highlight.length; i ++) {
        if (isDataCell(cell, area, highlight[i])) {
          Object.assign(
              cellElement.style,
              getCssStyle(
                  highlight[i],
                  cellElement,
                  cell
              )
          );
        }
      }
    }
  };
  let showTotalsPrior = 'both';
  const rowTotalPos = meta.positionOption.row.position == 'top';
  const columnTotalPos = meta.positionOption.column.position == 'left';

  if (rowTotalPos && columnTotalPos) {
    showTotalsPrior = 'both';
  } else if (rowTotalPos && !columnTotalPos) {
    showTotalsPrior = 'rows';
  } else if (!rowTotalPos && columnTotalPos) {
    showTotalsPrior = 'columns';
  } else {
    showTotalsPrior = 'none';
  }

  const fieldCount = mart.dataSourceConfig.fields().reduce((acc, f) => {
    if (f.area == 'column') {
      acc.column++;
    }
    if (f.area == 'row') {
      acc.row++;
    }
    return acc;
  }, {row: 0, column: 0});

  const fieldPanel = {
    allowFieldDragging: false,
    showColumnFields: fieldCount.column > 0,
    showDataFields: false,
    showFilterFields: false,
    showRowFields: fieldCount.row > 0,
    visible: meta.showFilter
  };

  return (
    <DevPivotGrid
      ref={ref}
      id={id}
      width={'100%'}
      height={'100%'}
      dataSource={mart.dataSourceConfig}
      showColumnTotals={meta.positionOption.column.totalVisible}
      showRowTotals={meta.positionOption.row.totalVisible}
      showColumnGrandTotals={meta.positionOption.column.grandTotalVisible}
      showRowGrandTotals={meta.positionOption.row.grandTotalVisible}
      rowHeaderLayout={meta.layout}
      dataFieldArea={meta.positionOption.dataPosition}
      allowFiltering={meta.showFilter}
      fieldPanel={fieldPanel}
      showTotalsPrior={showTotalsPrior}
      wordWrapEnabled={false}
      onCellPrepared={onCellPrepared}
      allowSorting={true}
      allowSortingBySummary={true}
      onContextMenuPreparing={(e) => {
        const contextMenu = [];

        const isGrandTotal =
          (e.cell.columnType == 'GT' && e.cell.rowType == 'GT') ||
          e.cell.type == 'GT';

        // TODO: 추후 비정형 보고서에서만 보이게 수정해야 함.
        // 상세데이터 contextMenu 시작
        // row와 column 모두 총계인 셀은 선택 불가
        if (detailedData && !isGrandTotal) {
          // 현재 사용하고 있는 측정값의 테이블에 해당하는 상세 데이터만 렌더링
          const regex = /\[([^\[\]]+)\]/;
          const rowColFilters = [];
          const detailedDataMenu = {
            'text': localizedString.detailedData
          };

          const dims = meta.dataField.column.concat(meta.dataField.row);

          // 클릭 이벤트 생성
          detailedDataMenu.items = detailedData.filter((data) => {
            return meta.dataField.measure.find((mea) => {
              return data.targetTable == mea.uniqueName.match(regex)[0];
            });
          }).map((act) => ({
            'text': act.actNm,
            'onItemClick': async () => {
              // 현재 선택된 row와 col 필터 generate
              for (let i = 0; i < e.cell.columnPath.length; i++) {
                const val = e.cell.columnPath[i];
                const col = e.columnFields[i];

                const dim = dims.find((d) => d.name == col.dataField);

                const cubeInfo = await DetailedDataUtility.getCubeColumnInfo(
                    dataset.cubeId, dim.uniqueName);
                const parameter = DetailedDataUtility.getParameterInformation(
                    '@C_' + dim.name, dataset, cubeInfo, val);

                rowColFilters.push(parameter);
              }

              for (let i = 0; i < e.cell.rowPath.length; i++) {
                const val = e.cell.rowPath[i];
                const row = e.rowFields[i];

                const dim = dims.find((d) => d.name == row.dataField);

                const cubeInfo = await DetailedDataUtility.getCubeColumnInfo(
                    dataset.cubeId, dim.uniqueName);
                const parameter = DetailedDataUtility.getParameterInformation(
                    '@R_' + dim.name, dataset, cubeInfo, val);

                rowColFilters.push(parameter);
              }

              // 보고서에 적용된 필터와 합치기
              const parameters = selectRootParameter(store.getState());
              rowColFilters.push(
                  ...ParamUtils.generateParameterForQueryExecute(parameters));

              // 상세데이터 조회
              const param = {
                dsId: dataset.dsId,
                cubeId: dataset.cubeId,
                userId: 'admin',
                actId: act.actId,
                parameter: JSON.stringify(rowColFilters)
              };

              models.Item.getDetailedData(param).then((res) => {
                openModal(ShowDataModal, {
                  modalTitle: localizedString.detailedData + ' - ' + act.actNm,
                  data: res.data.rowData
                });
              });
            }
          }));
          if (detailedDataMenu.items.length > 0) {
            contextMenu.push(detailedDataMenu);
          }
        }
        // contextMenu 저장(리턴)
        e.items = contextMenu;
      }}
    >
      <FieldChooser enabled={false}> </FieldChooser>
      <Scrolling mode='virtual' />
    </DevPivotGrid>
  );
};

export default React.memo(PivotGrid);
