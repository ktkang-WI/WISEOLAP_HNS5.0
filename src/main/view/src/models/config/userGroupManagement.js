import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/config';

export const getGeneralConfig = async () => {
  const res = await axios.get(path + '/general-data');
  return res;
};

export const getUserGroupManagement = async () => {
  const res = await axios.get(path + '/user-group-data');
  return res;
};
