import ParamUtils from 'components/dataset/utils/ParamUtils';
import axios from 'axios';

const path = '/dataset';

export const dbTables = (dsId, search) => {
  return axios.post(path + '/db-tables', {
    dsId: dsId,
    search: search
  });
};

export const dbColumns = (dsId, table, search) => {
  return axios.post(path + '/db-columns', {
    dsId: dsId,
    table: table
  });
};

export const getTablesByMart = (dsId) => {
  return axios.post(path + '/query-dataset-tables', {
    dsId: parseInt(dsId)
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

/**
* @param {*} dsId
* @param {*} query
* @param {*} parameters
* @return {axios}
*/
export const getAllDatasetDatas = (dsId, query, parameters) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return axios.post(path + '/query-dataset-allDatas', {
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter)
  });
};

export const dbUploadTables = (dsId, search) => {
  return axios.post(path + '/db-upload-tables', {
    dsId: dsId,
    search: search
  });
};
