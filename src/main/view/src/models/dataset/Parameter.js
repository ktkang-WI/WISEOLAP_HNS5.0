import axios from 'axios';

const path = '/dataset';


export const getDefaultValue = (param) => {
  let defaultValue = param.defaultValue;

  if (param.operation != 'BETWEEN') {
    defaultValue = [defaultValue[0]];
  }

  return axios.post(path + '/param-default-value', {
    dsId: param.dsId,
    defaultValue: JSON.stringify(defaultValue)
  });
};

export const getListItems = (param, linkageValues) => {
  let defaultValue = param.defaultValue;

  if (param.operation != 'BETWEEN') {
    defaultValue = [defaultValue[0]];
  }

  return axios.post(path + '/param-list-items', {
    dsId: param.dsId,
    dataSourceType: param.dataSourceType,
    dataSource: param.dataSource,
    dataType: param.dataType,
    linkageValues: JSON.stringify(linkageValues || []),
    itemKey: param.itemKey,
    itemCaption: param.itemCaption,
    sortBy: param.sortBy,
    sortOrder: param.sortOrder,
    operation: param.operation,
    defaultValue: JSON.stringify(defaultValue),
    defaultValueUseSql: param.defaultValueUseSql,
    useAll: param.useAll,
    multiSelect: param.multiSelect,
    useSearch: param.useSearch,
    // 데이터집합 디자이너 에서 "확인"을 눌렀을 때 아래 조건에 따라 동작하도록 수정:
    // 1. searchValue 값이 undefined인 경우
    // 2. 데이터 검색(useSearch)이 활성화된 상태인 경우
    // 3. 기본값(defaultValue)이 빈 문자열이 아닌 경우
    // 위 조건을 모두 만족하면 기본값을 사용하여 paramList 데이터를 가져오도록 처리
    searchValue: !param.searchValue && param.useSearch &&
      param.defaultValue[0] !== '' ?
      param.defaultValue[0] : param.searchValue
  });
};
