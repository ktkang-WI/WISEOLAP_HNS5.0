import axios from 'axios';
import {path} from '../Authority';

export const generateAxios = async (currentTab, data) => {
  if (currentTab == path.GROUP_DATASOURCE) {
    return await generatePutDsAxios(currentTab, data);
  }
};

const generatePutDsAxios = async (currentTab, data) => {
  const generatedData = data.map((d) => {
    return {
      grpId: d.group.grpId,
      dsIds: d.ds.map((ds) => ds.dsId)
    };
  });
  const res = axios.put(currentTab, {
    data: generatedData
  });
  return res;
};

export const generateGetAxios = async (path) => {
  return await axios.get(path);
};
