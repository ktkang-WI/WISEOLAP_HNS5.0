import axios from 'axios';

const path = '/dataset';

export const getByUserId = (userId) => {
  return axios.post(path + '/ds-views', {
    userId: userId
  });
};
