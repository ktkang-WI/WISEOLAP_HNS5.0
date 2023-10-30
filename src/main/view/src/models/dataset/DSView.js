import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/dataset';


export const getByUserId = async (userId) => {
  const res = await axios.post(path + '/ds-views', {
    userId: userId
  });

  return res.data;
};

export const getByTables = async (datasource) => {
  const res = await axios.post(path + '/queryDataset-getTables', datasource);

  return res.data;
};

export const getByQueryValidate = async (datasource) => {
  const res = await axios.post(path + '/queryDataset-getValidate', datasource);

  return res.data;
};

export const getByQueryDsView = async (datasource) => {
  const res = await axios.post(path + '/queryDataset-getDsview', datasource);

  return res.data;
};
