import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const configPath = document.location.origin + contextRoot + '/config';

export const getGeneralConfig = async () => {
  const res = await axios.get(configPath + '/general');
  return res;
};

export const updateGeneralConfig = async (general) => {
  const res = await axios.patch(configPath + '/general', null, {
    params: general
  });
  return res;
};
