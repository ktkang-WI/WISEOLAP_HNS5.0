import DevPivotGrid, {
  FieldChooser,
  Scrolling
} from 'devextreme-react/pivot-grid';
import {useEffect, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import getCssStyle from './GetCssStyle';
import isDataCell from './IsDataCell';

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

  const selectedItemId = useSelector(selectCurrentItem);

  // highlight 추가, 변경 시 repaint(컴포넌트를 다시 그려줌)
  useEffect(() => {
    ref.current.instance.repaint();
  }, [selectedItemId.meta.highlight]);
  // 하이라이트를 가져옴.
  const highlight = useMemo(() => {
    return selectedItemId.meta.highlight;
  }, [selectedItemId.meta.highlight]);
  // 하이라이트를 hashMap으로 만들어서 사용.
  const highlightMap = useMemo(() => {
    const map = new Map();

    for (let i =0; i< highlight.length; i++) {
      map.set(highlight[i].idx, highlight[i]);
    }
    return map;
  }, [selectedItemId.meta.highlight]);

  const pivoCellPrepared = ({cell, area, cellElement}) => {
    if (highlightMap.get(cell.dataIndex) && highlight.length != 0) {
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
