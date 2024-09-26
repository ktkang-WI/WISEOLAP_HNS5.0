import axios from 'axios';

const path = '/portal';

export const getCardData = (date) => {
  return axios.get(path + `/card-data?date=${date}`);
};
