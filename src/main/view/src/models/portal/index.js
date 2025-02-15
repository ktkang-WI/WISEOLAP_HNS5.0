import axios from 'axios';

const path = '/portal';

export const getCardData = (auth, date, type, team = '') => {
  return axios.get(path + `/card-data`, {params: {
    auth,
    date,
    type,
    team
  }});
};

export const getAdminCardData = (date, type, team) => {
  return axios.get(path + `/admin-card-data`, {params: {
    date,
    type,
    team
  }});
};

export const getTeamList = (auth, date) => {
  return axios.get(path + '/team-list', {params: {auth, date}});
};

export const getMaxDate = () => {
  return axios.get(path + '/max-date');
};

export const getPortalInfo = (auth) => {
  return axios.get(path + '/portal-info', {params: {auth}});
};

export const getPortalConfig = () => {
  return axios.get(path + '/portal-config');
};

export const setPortalConfig = (data) => {
  return axios.put(path + '/portal-config', {data});
};
