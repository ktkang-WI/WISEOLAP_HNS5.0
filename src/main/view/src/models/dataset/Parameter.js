import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/dataset';


export const getDefaultValue = async (param) => {
  let defaultValue = param.defaultValue;

  if (param.operation != 'BETWEEN') {
    defaultValue = [defaultValue[0]];
  }

  const res = await axios.post(path + '/param-default-value', {
    dsId: param.dsId,
    defaultValue: JSON.stringify(defaultValue)
  });

  return res.data;
};

export const getListItems = async (param, linkageValues) => {
  let defaultValue = param.defaultValue;

  if (param.operation != 'BETWEEN') {
    defaultValue = [defaultValue[0]];
  }

  const res = await axios.post(path + '/param-list-items', {
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

  return res.data;
};
