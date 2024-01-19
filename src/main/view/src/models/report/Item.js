import axios from 'axios';

const path = '/report';

/**
 * 아이템 조회
 * @param {JSON} param
 * @return {axios}
 */
export const getItemData = (param) => {
  return axios.post(path + '/item-data', param);
};

export const getPivotData = async (param) => {
  return axios.post(path + '/item-data', param);
};

/**
 * 비정형 아이템 조회
 * @param {JSON} param
 * @return {axios}
 */
export const getAdHocItemData = (param) => {
  return axios.post(path + '/adhoc-item-data', param);
};
