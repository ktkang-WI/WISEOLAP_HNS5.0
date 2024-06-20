import axios from 'axios';
import {path} from '../Authority';

export const generateAxios = async (currentTab, data) => {
  if (
    currentTab == path.GROUP_DATASOURCE ||
    currentTab == path.USER_DATASOURCE
  ) {
    return await generatePutDsAxios(currentTab, data);
  }
};

const generatePutDsAxios = async (currentTab, data) => {
  const filteredData = data.filter((item) => item.dsIds.length > 0);
  const res = axios.put(currentTab, {
    data: filteredData
  });
  return res;
};

export const generateGetAxios = async (path) => {
  return await axios.get(path);
};
