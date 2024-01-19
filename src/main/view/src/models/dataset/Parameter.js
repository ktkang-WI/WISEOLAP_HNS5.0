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
    defaultValueUseSql: param.defaultValueUseSql
  });
};
