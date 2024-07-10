import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const configPath = document.location.origin + contextRoot + '/config/general';

export const getGeneralConfig = async () => {
  return await axios.get(configPath);
};

export const updateGeneralConfig = async (data) => {
  const object = {
    config: JSON.stringify(data)
  };
  return await axios.patch(configPath, null, {
    params: object
  });
};
