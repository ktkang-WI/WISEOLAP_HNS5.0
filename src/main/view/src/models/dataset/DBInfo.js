import ParamUtils from 'components/dataset/utils/ParamUtils';
import instance from 'models/instance';

const path = '/dataset';

export const dbTables = (dsId, search) => {
  return instance.post(path + '/db-tables', {
    dsId: dsId,
    search: search
  });
};

export const dbColumns = (dsId, table, search) => {
  return instance.post(path + '/db-columns', {
    dsId: dsId,
    table: table
  });
};

export const getTablesByMart = (dsId) => {
  return instance.post(path + '/query-dataset-tables', {
    dsId: parseInt(dsId)
  });
};

/**
 * @param {*} dsId
 * @param {*} query
 * @param {*} parameters
 * @param {*} rowNum data를 가져올 row수 0일 경우 전부 가져옴
 * @return {axios}
 */
export const getDataByQueryMart = (dsId, query, parameters, rowNum) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return instance.post(path + '/query-dataset-datas', {
    dsId: parseInt(dsId),
    query: query,
    parameter: JSON.stringify(parameter),
    rowNum: rowNum
  });
};
