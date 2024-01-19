import axios from 'axios';
import ParamUtils from 'components/dataset/utils/ParamUtils';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/dataset';

export const dbTables = async (dsId, search) => {
  const res = await axios.post(path + '/db-tables', {
    dsId: dsId,
    search: search
  });

  return res.data;
};

export const dbColumns = async (dsId, table, search) => {
  const res = await axios.post(path + '/db-columns', {
    dsId: dsId,
    table: table
  });

  return res.data;
};

export const getTablesByMart = async (dsId) => {
  const res = await axios.post(path + '/query-dataset-tables', {
    dsId: parseInt(dsId)
  });

  return res.data;
};

/* eslint-disable valid-jsdoc */
/**
 * @param {*} dsId
 * @param {*} query
 * @param {*} parameters
 * @param {*} rowNum data를 가져올 row수 0일 경우 전부 가져옴
 * @returns
 */
export const getDataByQueryMart = async (dsId, query, parameters, rowNum) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  const res = await axios.post(path + '/query-dataset-datas', {
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter),
    rowNum: rowNum
  });

  return res.data;
};
