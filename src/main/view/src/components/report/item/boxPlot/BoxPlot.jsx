import {useRef, useEffect, useState, useCallback} from 'react';
import D3BoxPlot from './component/D3BoxPlot';
import useQueryExecute from 'hooks/useQueryExecute';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';


const BoxPlot = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  const getDataField = useCallback(() => {
    return meta.dataField;
  }, [mart.data]);

  const interactiveOption = meta.interactiveOption;
  // TODO: 추후 팔레트 적용

  let palette;

  if (meta.paletteType === 'colorEdit') {
    palette = meta.colorEdit;
  } else {
    palette = meta.palette.colors;
  }

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

  // 마스터 필터 관련 useEffect
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

  const ref = useRef();

  const getFilter = (selectedItem) => {
    const dataField = getDataField();
    const dim = dataField.dimension;

    // 선택된 데이터 '차원명': Set 형태로 가공
    const filters = selectedItem.reduce((acc, filter) => {
      filter.split(' - ').forEach((v, i) => {
        if (dim.length <= i) return;
        const name = dim[i].uniqueName;
        if (v == '\u2800') {
          v = null;
        }

        if (acc[name]) {
          acc[name].add(v);
        } else {
          acc[name] = new Set([v]);
        }
      });
      return acc;
    }, {});

    // Set Array로 변환
    for (const filter in filters) {
      if (filters[filter]) {
        filters[filter] = [...filters[filter]];
      }
    }

    return filters;
  };

  const selectItem = (key) => {
    if (!interactiveOption.enabled) return;

    let newSelectedItem = [];
    // 이미 선택되어 있는 아이템 클릭시 해제
    if (selectedItem.includes(key)) {
      newSelectedItem = selectedItem.filter((name) => key != name);
    } else {
      if (interactiveOption.mode == 'single') {
        newSelectedItem = [key];
      } else {
        newSelectedItem = [...selectedItem, key];
      }
    }

    setSelectedItem(newSelectedItem);
    filterItems(item, getFilter(newSelectedItem));
  };

  return (
    <Wrapper ref={ref}>
      <D3BoxPlot
        width={width}
        height={height}
        data={mart.data}
        id={item.id}
        palette={palette}
        selectedItem={selectedItem}
        onClick={selectItem}
        yAxis={meta.yAxis}
        legend={meta.legend}
        measures={getDataField().measure}
      />
    </Wrapper>
  );
};

export default BoxPlot;
