import {useEffect, useState, useCallback} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';


const Template = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  // 재조회 하지 않고 데이터 항목을 수정할 경우, 수정된 dataField값을 가져와 다양한 예외가 발생함.
  // 때문에 data가 변경될 때만 dataField를 저장하여 반환하는 메서드 사용
  const getDataField = useCallback(() => {
    return meta.dataField;
  }, [mart.data]);

  const interactiveOption = meta.interactiveOption;

  // 마스터 필터를 담을 변수. dev아이템의 경우 state로 사용하지 않아도 무방(Chart.jsx참고)
  const [selectedItem, setSelectedItem] = useState([]);
  const {filterItems, clearAllFilter} = useQueryExecute();


  // 재조회시 필터가 초기화 되므로 선택 초기화
  useEffect(() => {
    setSelectedItem([]);
  }, [interactiveOption]);

  // 상호작용 관련 값이 변경될 경우 현재 필터 초기화
  useEffect(() => {
    setSelectedItem([]);
    filterItems(item, {});
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled]);

  // crossDataSource 설정 변경시 동일한 데이터 집합이 아니어도 필터 삭제제
  useEffect(() => {
    clearAllFilter(item);
  }, [interactiveOption.crossDataSource]);

  // 기아-K3 등 splitter로 이루어진 차원 String을 분리해서 필터로 가공합니다.
  // 아이템에 따라 수정이 필요하며, 해당 메서드를 쓰지 않아도 상관 없습니다.
  const getFilter = (selectedItem) => {
    const dataField = getDataField();
    const dim = dataField.dimension;

    // 선택된 데이터 '차원명': Set 형태로 가공
    const filters = selectedItem.reduce((acc, filter) => {
      filter.split(' - ').forEach((v, i) => {
        if (dim.length <= i) return;
        const name = dim[i].uniqueName;
        // null일 경우 splitter 사용시 오류가 발생할 수 있어
        // 유니코드 빈칸 문자로 대체하여 사용용
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
    <item onClick={({value}) => selectItem(value)}/>
  );
};

export default Template;
