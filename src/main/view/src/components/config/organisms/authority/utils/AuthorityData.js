import axios from 'axios';
import {getDataObjectOfUserOrGroup, mode, path} from '../Authority';

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
  else if (
    currentTab == path.GROUP_DATA ||
    currentTab == path.USER_DATA
  ) return await generatePutDataAxios(currentTab, data);
};

const generatePutDataAxios = async (currentTab, data) => {
  const dataSetMode =
    currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;
  const filterDatas = data.filter((d) => d.datas.length > 0);
  // TODO: 차원값 내부 [] <- 값으로 인하여 해당 함수 존재. 추후 [] 내부값이 필요없을 경우 삭제 필요
  const filteredData = filterDatas.map((d) => ({
    ...getDataObjectOfUserOrGroup(dataSetMode, (d.grpId || d.userNo)),
    datas: d.datas
        .filter((f) =>
          (f?.cubeId?.length ?? 0) !== 0 || (f?.dsViewDim?.length ?? 0) !== 0)
        .map((cube) => ({
          cubeId: cube?.cubeId,
          dsViewDim: cube?.dsViewDim?.map((c) => {
            const match = (c.hieUniNm || c.dimDimUniNm)
                .match(/\[(.*?)\].\[(.*?)\]/);
            return {
              dsViewId: c.dsViewId,
              cubeId: c.cubeId,
              dimDimUniNm: match[1],
              hieUniNm: match[2]
            };
          })
        }))
  }));

  const res = axios.put(currentTab, {
    data: filteredData
  });
  return res;
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
