import axios from 'axios';
import {path} from '../Authority';

export const generateAxios = async (currentTab, data) => {
  if (
    currentTab == path.GROUP_DATASOURCE ||
    currentTab == path.USER_DATASOURCE
  ) {
    return await generatePutDsAxios(currentTab, data);
  } else if (
    currentTab == path.GROUP_REPORT ||
    currentTab == path.USER_REPORT
  ) return await generatePutReportAxios(currentTab, data);
  else if (
    currentTab == path.GROUP_DATASET ||
    currentTab == path.USER_DATASET
  ) return await generatePutDataSetAxios(currentTab, data);
};

const generatePutDsAxios = async (currentTab, data) => {
  const filteredData = data.filter((item) => item.dsIds.length > 0);
  const res = axios.put(currentTab, {
    data: filteredData
  });
  return res;
};

const generatePutDataSetAxios = async (currentTab, data) => {
  const filteredData = data.filter((item) => item.fldId.length > 0);
  const res = axios.put(currentTab, {
    data: filteredData
  });
  return res;
};


const generatePutReportAxios = async (currentTab, data) => {
  const res = axios.put(currentTab, {
    data: data
  });
  return res;
};


export const generateGetAxios = async (path) => {
  return await axios.get(path);
};
