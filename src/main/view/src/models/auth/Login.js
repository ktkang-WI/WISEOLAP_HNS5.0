import axios from 'axios';

const path = '/login';

export const login = (id, password) => {
  return axios.post(path + '/login', {
    id: id,
    password: password
  });
};
