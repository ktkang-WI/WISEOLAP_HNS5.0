import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectSpread} from 'redux/selector/SpreadSelector';

const selectCurrentItemsFunction = (designerMode) => {
  const currentItems =
    useSelector(designerMode == 'Excel' ? selectSpread : selectCurrentItems);
  return currentItems;
};

// 쿼리 보기 selectbox 데이터 설정
const setDataSource = (designerMode, currentItems) => {
  const itemNames = [];
  if (designerMode === 'Excel') {
    const datasets = Object.keys(currentItems.meta.bindingInfos);
    const spreadBindInfo = currentItems.meta.bindingInfos;

    datasets.forEach((data) => {
      // 데이터집합 연동 안된 sheet 제외
      if (spreadBindInfo[data].sheetNm != '') {
        itemNames.push(spreadBindInfo[data].sheetNm);
      }
    });
  } else {
    currentItems.forEach((item) => {
      // 조회 안된 아이템 제외.
      if (item) {
        itemNames.push(item.meta.name);
      }
    });
  }

  return itemNames;
};

const setQuery = (designerMode, currentItems, name) => {
  // 스프레드 쿼리보기 init
  if (designerMode == 'Excel') {
    const datasets = Object.keys(currentItems.mart.spreadData);
    let data = datasets[0];
    if (name) {
      const bindingInfos = currentItems.meta.bindingInfos;
      data = datasets.find((item) => bindingInfos[item].sheetNm == name);
    }

    const query = currentItems.mart['spreadData'][data]?.query;
    return query;
  } else {
    if (!currentItems[0]) return '';

    let selectItemQuery = currentItems[0].mart.data.query;
    // 비정형 피벗그리드만 보기 후 쿼리보기
    if (designerMode === 'AdHoc' && !selectItemQuery) {
      selectItemQuery = currentItems[1].mart.data.query;
    }

    if (name) {
      selectItemQuery =
        currentItems.find((item) => item.meta.name === name);
      selectItemQuery = selectItemQuery.mart.data.query;
    }
    return selectItemQuery;
  }
};

export {
  selectCurrentItemsFunction,
  setDataSource,
  setQuery
};
