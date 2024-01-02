import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import {useCallback, useEffect, useRef} from 'react';

const PivotGrid = ({id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

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

  // 조회할 때만 필터 표시 반영하기 위해 useCallback 사용
  const getFieldPanel = useCallback(() => {
    return {
      allowFieldDragging: false,
      showColumnFields: meta.dataField.column.length > 0,
      showDataFields: false,
      showFilterFields: false,
      showRowFields: meta.dataField.row.length > 0,
      visible: meta.showFilter
    };
  }, [mart]);


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
      fieldPanel={getFieldPanel()}
      showTotalsPrior={showTotalsPrior}
      wordWrapEnabled={false}
      allowSorting={false}
      allowSortingBySummary={false}
    >
      <FieldChooser enabled={false}> </FieldChooser>
      <Scrolling mode="virtual" />
    </DevPivotGrid>
  );
};

export default PivotGrid;
