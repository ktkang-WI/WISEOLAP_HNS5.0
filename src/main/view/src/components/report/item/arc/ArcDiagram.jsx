import {useEffect, useState, useCallback, useRef} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import D3ArcDiagram from './component/D3ArcDiagram';

const ArcDiagram = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  const getDataField = useCallback(() => {
    return meta.dataField;
  }, [mart.data]);

  const interactiveOption = meta.interactiveOption;

  const ref = useRef();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [selectedItem, setSelectedItem] = useState([]);
  const {filterItems, clearAllFilter} = useQueryExecute();

  // svg 크기 조절 useEffect
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setHeight(ref.current.offsetHeight);
      setWidth(ref.current.offsetWidth);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setSelectedItem([]);
  }, [interactiveOption]);

  useEffect(() => {
    setSelectedItem([]);
    filterItems(item, {});
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled]);

  useEffect(() => {
    clearAllFilter(item);
  }, [interactiveOption.crossDataSource]);

  let palette;

  if (meta.paletteType === 'colorEdit') {
    palette = meta.colorEdit;
  } else {
    palette = meta.palette.colors;
  }

  const selectItem = (key, id) => {
    if (!interactiveOption.enabled) return;

    let newSelectedItem = [];
    // 이미 선택되어 있는 아이템 클릭시 해제
    if (selectedItem[key]?.includes(id)) {
      newSelectedItem = {
        ...selectedItem,
        [key]: selectedItem[key].filter((name) => name != id)
      };

      if (newSelectedItem[key].length == 0) {
        delete newSelectedItem[key];
      }
    } else {
      if (interactiveOption.mode == 'single') {
        newSelectedItem = {[key]: [id]};
      } else {
        newSelectedItem = {
          ...selectedItem,
          [key]: [...(selectedItem[key] || []), id]
        };
      }
    }

    setSelectedItem(newSelectedItem);
    filterItems(item, newSelectedItem);
  };

  return (
    <Wrapper ref={ref}>
      <D3ArcDiagram
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        dimensions={getDataField().dimension}
        palette={palette}
        rotated={meta.useRotate}
        legend={meta.legend}
        selectedItem={selectedItem}
        onClick={selectItem}
      />
    </Wrapper>
  );
};

export default ArcDiagram;
