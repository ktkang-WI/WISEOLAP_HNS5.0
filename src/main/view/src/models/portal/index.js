import axios from 'axios';

const path = '/portal';

export const getCardData = (date, type) => {
  return axios.get(path + `/card-data`, {params: {
    date,
    type
  }});
};

export const getAdminCardData = (date, type, team) => {
  return axios.get(path + `/admin-card-data`, {params: {
    date,
    type,
    team
  }});
};

export const getTeamList = (date) => {
  return axios.get(path + '/team-list', {params: {date}});
};

export const getMaxDate = () => {
  return axios.get(path + '/max-date');
};
