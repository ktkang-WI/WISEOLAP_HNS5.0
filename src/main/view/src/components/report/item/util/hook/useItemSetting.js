import useQueryExecute from 'hooks/useQueryExecute';
import {useCallback, useEffect, useRef, useState} from 'react';

/**
 * 아이템 필수 세팅 hook
 * @param {JSON} item 아이템 객체
 * @param {JSON} adHocOption 비정형 옵션
 * @param {Array} fieldDependency getDataField 갱신 기준(없으면 데이터가 변할 때만 갱신)
 * @param {Array} filterCondition 마스터 필터 로직 적용 조건 (true일 경우 마스터필터 미적용)
 * @param {JSON} filterOptions 마스터 필터에 필요한 옵션션
 * @return {JSON} functions
 */
export default function useItemSetting(
    item,
    adHocOption = null,
    fieldDependency = [],
    filterCondition = false,
    filterOptions = {
      selectedItemType: 'STATE', // 'STATE' or 'REF' REF로 사용시 리렌더링 일어나지 않음
      selectItem: () => {},
      clearSelection: () => {}
    }
) {
  const {selectedItemType, clearSelection} = filterOptions;
  const splitters = ['<br/>', ' - ', '-'];
  const meta = item.meta;
  const interactiveOption = filterCondition ?
    {} : meta.interactiveOption;
  const {filterItems, clearAllFilter} = useQueryExecute();
  const [selectedItemState, setSelectedItemState] = useState([]);
  const selectedItemRef = useRef([]);

  /**
   * 현재 선택된 데이터를 반환합니다.
   * @param {boolean} onlyName true일시 현재 선택된 아이템 이름만 반환환
   * @return {object}
   */
  const getSelectedItem = (onlyName) => {
    let state = [];
    if (selectedItemType == 'STATE') {
      state = selectedItemState;
    } else {
      state = selectedItemRef.current;
    }

    if (onlyName) {
      if (Array.isArray(state)) {
        state = state.map((v) => v.name);
      } else {
        const keys = Object.keys(state);
        state = keys.map((acc, key) => {
          acc.push(...state[key]);
          return acc;
        }, []);
      }
    }

    return state;
  };

  const setSelectedItem = (state) => {
    if (selectedItemType == 'STATE') {
      setSelectedItemState(state);
    } else {
      selectedItemRef.current = state;
    }
  };

  useEffect(() => {
    reloadMasterFilter();
  }, [item.meta, item.mart]);

  useEffect(() => {
    if (getSelectedItem().length > 0) {
      setSelectedItem([]);
      clearSelection();
    }
  }, [item.mart.toggle]);

  useEffect(() => {
    if (!filterCondition && item.mart.init) {
      clearSelection();
      setSelectedItem([]);
      filterItems(item, {});
    }
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled]);

  useEffect(() => {
    if (!filterCondition && item.mart.init) {
      clearSelection();
      setSelectedItem([]);
      clearAllFilter(item);
    }
  }, [
    interactiveOption.crossDataSource
  ]);

  const findSplitter = (data) => {
    const splitter = splitters.find((splitter) => data.includes(splitter));
    return splitter || 'wise-none';
  };

  const setMasterFilterDataForString = (data, func, reverse) => {
    const selectedItem = getSelectedItem();
    const splitter = findSplitter(data);
    const targetDimension = interactiveOption.targetDimension || 'dimension';
    let newSelectedItem = [];
    // 이미 선택되어 있는 아이템 클릭시 해제
    if (selectedItem.find((item) => item.name == data)) {
      newSelectedItem = selectedItem.filter(({name}) => data != name);
    } else {
      if (interactiveOption.mode == 'single') {
        newSelectedItem = [{name: data, func}];
      } else {
        newSelectedItem = [...selectedItem, {name: data, func}];
      }
    }

    setSelectedItem(newSelectedItem);

    let fields = getDataField()[targetDimension];

    if (!fields) {
      fields = getDataField().field.filter((field) => field.type == 'DIM');
    }

    return makeFilterWithSplitter(
        newSelectedItem, fields, splitter, reverse);
  };

  const setMasterFilterDataForObject = (data) => {
    const key = Object.keys(data)[0];
    const value = data[key];
    const selectedItem = getSelectedItem();

    let newSelectedItem = [];
    // 이미 선택되어 있는 아이템 클릭시 해제
    if (selectedItem[key]?.includes(value)) {
      newSelectedItem = {
        ...selectedItem,
        [key]: selectedItem[key].filter((name) => name != value)
      };

      if (newSelectedItem[key].length == 0) {
        delete newSelectedItem[key];
      }
    } else {
      if (interactiveOption.mode == 'single') {
        newSelectedItem = {[key]: [value]};
      } else {
        newSelectedItem = {
          ...selectedItem,
          [key]: [...(selectedItem[key] || []), value]
        };
      }
    }

    setSelectedItem(newSelectedItem);
    return newSelectedItem;
  };

  /**
   * 마스터필터 적용 메서드
   * @param {Object} data 'DIM1-DIM2' 또는 {DIM: 'DIM1'} 형태의 데이터 입력
   * @param {function} func data가 string인 경우에만 사용. 아이템 리렌더링시 사용될 이벤트
   * @param {boolean} reverse data가 string인 경우에만 사용. 차원 순서가 뒤집어져 있는 경우 true
   */
  const setMasterFilterData = (data, func = () => {}, reverse = false) => {
    if (!data) return;
    if (!interactiveOption.enabled) return;

    let filters = {};

    const getFilter = (filterData) => {
      let filter;
      if (typeof filterData == 'string') {
        // 들어온 데이터 형태가 문자열인 경우
        if (func) {
          func();
        }
        filter = setMasterFilterDataForString(filterData, func, reverse);
      } else if (typeof filterData == 'object') {
        // 들어온 데이터의 형태가 {[key] : value}인 경우
        filter = setMasterFilterDataForObject(filterData);
      }

      return filter;
    };

    if (Array.isArray(data)) {
      // 들어온 데이터 형태가 배열인 경우
      data.forEach((row) => {
        filters = getFilter(row, func, reverse);
      });
    } else {
      filters = getFilter(data);
    }

    filterItems(item, filters);
  };

  /**
   * ['DIM1-DIM2-DIM3', 'DIM1-DIM2-DIM3'] 다음과 같이 splitter로 구분된
   * selectedData를 마스터 필터의 표준 형태로 전환
   * @param {Array} selectedData 필터 데이터. 형식: ['DIM1-DIM2-DIM3']
   * @param {Array} field 필터 데이터에 대응되는 필드 리스트
   * @param {string} splitter 데이터를 구분하고 있는 splitter
   * @param {boolean} reverse 데이터가 뒤집어져 있는지 여부
   * @return {Array} filters
   */
  const makeFilterWithSplitter =
  (selectedData, field, splitter, reverse = false) => {
    const filters = selectedData.reduce((acc, filter) => {
      let splittedFilter = filter.name.split(splitter);
      if (reverse) {
        splittedFilter = splittedFilter.reverse();
      }

      splittedFilter.forEach((v, i) => {
        const name = field[i]?.uniqueName;
        if (!name) return acc;

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

    for (const filter in filters) {
      if (filters[filter]) {
        filters[filter] = [...filters[filter]];
      }
    }

    return filters;
  };

  /**
   * 팔레트 색상 배열을 반환합니다.
   * @return {Array} 팔레트 색상 배열
   */
  const getPalette = useCallback(() => {
    if (meta.paletteType == 'colorEdit') {
      return meta.colorEdit;
    }
    return meta.palette.colors;
  }, [item.meta.paletteType, item.meta.colorEdit, item.meta.palette]);

  /**
   * 현재 아이템에서 사용되고 있는 데이터 필드를 반환합니다.
   * fieldDependency가 별도로 존재하지 않는 경우 data가 변할 때만 값이 갱신됩니다.
   * dataField 직접 참조시 필드가 제거되거나 수정될 경우 예상치 못한 예외가 발생할 가능성이 있으므로
   * dataFeild를 가져올 땐 해당 메서드 사용을 권장합니다.
   * @return {JSON} dataField
   */
  const getDataField = useCallback(() => {
    return adHocOption?.dataField || item.meta.dataField;
  }, [item?.mart?.toggle, ...fieldDependency]);

  const reloadMasterFilter = () => {
    const selectedItem = getSelectedItem() || [];

    if (Array.isArray(selectedItem)) {
      selectedItem.forEach((item) => {
        if (item.func) {
          item.func();
        }
      });
    }
  };

  return {
    itemTools: {
      getDataField,
      getPalette
    },
    filterTools: {
      getSelectedItem,
      setMasterFilterData,
      reloadMasterFilter
    }
  };
};

