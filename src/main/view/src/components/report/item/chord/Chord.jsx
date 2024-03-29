import {useEffect, useState, useRef} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import D3Chord from './component/D3Chord';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';


const Chord = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

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

  const getFilter = (selectedItem) => {
    const filters = selectedItem.reduce((acc, filter) => {
      let v = filter.value;
      if (v == '\u2800') {
        v = null;
      }

      if (acc[filter.field]) {
        acc[filter.field].push(v);
      } else {
        acc[filter.field] = [v];
      }

      return acc;
    }, {});

    return filters;
  };

  const selectItem = (v) => {
    if (!interactiveOption.enabled) return;

    let newSelectedItem = [];
    // 이미 선택되어 있는 아이템 클릭시 해제
    if (selectedItem.find((i) => v.value == i.value)) {
      newSelectedItem = selectedItem.filter((i) => v.value != i.value);
    } else {
      if (interactiveOption.mode == 'single') {
        newSelectedItem = [v];
      } else {
        newSelectedItem = [...selectedItem, v];
      }
    }

    setSelectedItem(newSelectedItem);
    filterItems(item, getFilter(newSelectedItem));
  };

  // TODO: 추후 팔레트 적용

  let palette;

  if (meta.paletteType === 'colorEdit') {
    palette = meta.colorEdit;
  } else {
    palette = meta.palette.colors;
  }

  return (
    <Wrapper ref={ref}>
      <D3Chord
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={palette}
        selectedItem={selectedItem}
        onClick={selectItem}
        yAxis={meta.yAxis}
      />
    </Wrapper>
  );
};

export default Chord;
