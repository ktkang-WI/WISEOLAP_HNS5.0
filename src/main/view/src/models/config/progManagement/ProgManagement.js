import axios from 'axios';
import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');
const configPath = document.location.origin + contextRoot + '/config';

export const getProgList = () => {
  const res = axios.get(configPath + '/prog-list');
  return res;
};
