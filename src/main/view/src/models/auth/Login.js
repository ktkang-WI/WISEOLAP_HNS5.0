import axios from 'axios';

const path = '/login';

export const login = (id, password) => {
  return axios.post(path + '/login', {
    id: id,
    password: password
  });
};

export const checkPassword = (id, password) => {
  return axios.post(path + '/check-password', {
    id: id,
    password: password
  });
};

