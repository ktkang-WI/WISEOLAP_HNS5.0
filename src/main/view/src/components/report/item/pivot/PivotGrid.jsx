import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import {useEffect, useMemo, useRef} from 'react';
import React from 'react';
import {isDataCell, getCssStyle} from './DataHighlightUtility';

const PivotGrid = ({id, adHocOption, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const dataField = adHocOption ? adHocOption.dataField : meta.dataField;

  if (!mart.init) {
    return <></>;
  }

  const ref = useRef();

  useEffect(() => {
    const item = ref.current;

    if (!item) return;

    const element = item._element;

    // NOTE: Flex-layout 아이템 렌더링 => layout 리사이즈 사이클 이슈 때문에
    // ResizeObserver 추가
    const observer = new ResizeObserver(() => {
      const instance = item.instance;

      if (instance) {
        instance.updateDimensions();
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);


  // highlight 추가, 변경 시 repaint(컴포넌트를 다시 그려줌)
  useEffect(() => {
    ref.current.instance.repaint();
  }, [meta.dataHighlight]);

  // 하이라이트 목록을 가져옴.
  const highlight = useMemo(() => {
    return meta.dataHighlight;
  }, [meta.dataHighlight]);

  // 측정값의 순서로 그리드가 생성
  // -> 하이라이트를 측정값 순서 반대로 만들면 측정 조건에서 하이라이트 적용이 안됨.
  const highlightMap = useMemo(() => {
    const map = new Map();

    for (let i =0; i< highlight.length; i++) {
      map.set(highlight[i].idx, highlight[i]);
    }
    return map;
  }, [meta.dataHighlight]);

  const onCellPrepared = ({cell, area, cellElement}) => {
    if (highlightMap.get(cell.dataIndex) && highlight.length != 0) {
      // isDataCell -> 셀, 합계 셀, 총계 셀 체크에 대한 분기처리
      if (isDataCell(cell, area, highlightMap.get(cell.dataIndex)) ) {
        Object.assign(
            cellElement.style,
            getCssStyle(
                highlightMap.get(cell.dataIndex),
                cellElement,
                cell
            )
        );
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

  const fieldPanel = {
    allowFieldDragging: false,
    showColumnFields: dataField.column.length > 0,
    showDataFields: false,
    showFilterFields: false,
    showRowFields: dataField.row.length > 0,
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
      allowSorting={false}
      allowSortingBySummary={false}
    >
      <FieldChooser enabled={false}> </FieldChooser>
      <Scrolling mode="virtual" />
    </DevPivotGrid>
  );
};

export default React.memo(PivotGrid);
