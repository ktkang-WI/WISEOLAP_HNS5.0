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

export const getTablesByMart = async (datasource) => {
  const res = await axios.post(path + '/query-dataset-tables', {
    dsId: parseInt(datasource.dsId)
  });

  return res.data;
};

export const getDataByQueryMart = async (datasource, query, parameters) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  const res = await axios.post(path + '/query-dataset-fields', {
    dsId: parseInt(datasource.dsId),
    query: query,
    parameter: JSON.stringify(parameter)
  });

  return res.data;
};
