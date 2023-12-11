import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import {useCallback, useEffect, useRef} from 'react';

const PivotGrid = ({id, mart}) => {
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

  const test = useCallback(({cell, area, cellElement}) => {
    console.log('cell', cellElement);
    // console.log('area', area);
  });

  return (
    <DevPivotGrid
      ref={ref}
      id={id}
      dataSource={mart.dataSourceConfig}
      wordWrapEnabled={false}
      onCellPrepared={test}
    >
      <FieldChooser enabled={false}> </FieldChooser>
      <Scrolling mode="virtual" />
    </DevPivotGrid>
  );
};

export default PivotGrid;
