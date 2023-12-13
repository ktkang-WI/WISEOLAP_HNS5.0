import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import {useEffect, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import getCssStyle from './GetCssStyle';

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
  // 상위로 올리면 렌더링 꼬여서 에러.
  const selectedItemId = useSelector(selectCurrentItem);
  useEffect(() => {
    ref.current.instance.repaint();
  }, [selectedItemId.meta.highlight]);

  const isDataCell = (cell, area, highlight) => {
    console.log(highlight);
    return (
      area === 'data' && cell.rowType === 'D'
    );
  };
  const highlight = useMemo(() => {
    return selectedItemId.meta.highlight;
  }, [selectedItemId.meta.highlight]);

  const highlightMap = useMemo(() => {
    const map = new Map();
    for (let i =0; i< highlight.length; i++) {
      map.set(highlight[i].idx, highlight[i]);
    }
    return map;
  }, [selectedItemId.meta.highlight]);

  const pivoCellPrepared = ({cell, area, cellElement}) => {
    // console.log('cellElement', cellElement);
    // console.log('cell', cell);
    // console.log('area', area);
    // console.log('rowIndex', cellElement.rowIndex);
    // console.log('cellIndex', cellElement.cellIndex);
    // console.log('Map', highlightMap);
    // console.log('Map', highlightMap.get(cellElement.cellIndex));
    // console.log(selectedItemId);
    if (isDataCell(cell, area, highlight) && highlight.length != 0) {
      if (highlightMap.get(cellElement.cellIndex)) {
        Object.assign(
            cellElement.style,
            getCssStyle(
                highlightMap.get(cellElement.cellIndex),
                cellElement,
                cell
            )
        );
      }
    }
  };

  return (
    <DevPivotGrid
      ref={ref}
      id={id}
      dataSource={mart.dataSourceConfig}
      wordWrapEnabled={false}
      onCellPrepared={pivoCellPrepared}
    >
      <FieldChooser enabled={false}> </FieldChooser>
      <Scrolling mode="virtual" />
    </DevPivotGrid>
  );
};

export default PivotGrid;
