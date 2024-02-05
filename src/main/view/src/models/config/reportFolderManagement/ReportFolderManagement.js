import axios from 'axios';

const configPath = '/config';

export const getFolderReports = () => {
  const res = axios.get(configPath + '/folder-report');
  return res;
};

export const getFolders = () => {
  const res = axios.get(configPath + '/folder');
  return res;
};
