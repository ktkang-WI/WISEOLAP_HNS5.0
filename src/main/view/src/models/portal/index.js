import axios from 'axios';

const path = '/portal';

export const getCardData = (date, type) => {
  return axios.get(path + `/card-data`, {params: {
    date,
    type
  }});
};

export const getMaxDate = () => {
  return axios.get(path + '/max-date');
};
