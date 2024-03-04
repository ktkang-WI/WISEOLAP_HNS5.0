import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const configPath = document.location.origin + contextRoot + '/config';

export const getGeneralConfig = async () => {
  return await axios.get(configPath + '/general');
};

export const updateGeneralConfig = async (general) => {
  return await axios.patch(configPath + '/general', null, {
    params: general
  });
};

export const getSpread = async () => {
  return await axios.get(configPath + '/general/spread');
};

