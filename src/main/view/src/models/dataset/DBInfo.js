import ParamUtils from 'components/dataset/utils/ParamUtils';
import axios from 'axios';

const path = '/dataset';

export const dbTables = (dsId, search) => {
  return axios.post(path + '/db-tables', {
    dsId: dsId,
    search: search
  });
};

export const dsViewdbTables = (dsId, dsViewId, search) => {
  return axios.post(path + '/dsview-db-tables', {
    dsId: dsId,
    dsViewId: dsViewId,
    search: search
  });
};

export const dbColumns = (dsId, table, search) => {
  return axios.post(path + '/db-columns', {
    dsId: dsId,
    table: table
  });
};

export const getTablesByMart = (dsId, searchValue) => {
  return axios.post(path + '/query-dataset-tables', {
    dsId: parseInt(dsId),
    searchValue: searchValue
  });
};

/**
 * @param {*} dsId
 * @param {*} query
 * @param {*} parameters
 * @return {axios}
 */
export const getDataByQueryMart = (dsId, query, parameters) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return axios.post(path + '/query-dataset-datas', {
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter)
  });
};

export const getExecuteQueryData = (dsId, query, parameters) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return axios.post(path + '/execute-query', {
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter)
  });
};

/**
* @param {*} reportId
* @param {*} dsId
* @param {*} query
* @param {*} parameters
* @param {*} flag
* @return {axios}
*/
export const getAllDatasetDatas = (reportId, dsId, query, parameters, flag) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return axios.post(path + '/query-dataset-all-datas', {
    reportId,
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter),
    flag: flag
  });
};

export const dbUploadTables = (dsId, search) => {
  return axios.post(path + '/db-upload-tables', {
    dsId: dsId,
    search: search
  });
};
