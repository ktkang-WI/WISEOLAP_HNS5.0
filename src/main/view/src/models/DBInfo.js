import axios from 'axios';

const path = document.location.origin + '/dataset';

export const dbTables = async (dsId, search) => {
  const res = await axios.post(path + '/dbTables', {
    dsId: dsId,
    search: search
  });

  return res.data;
};

export const dbColumns = async (dsId, search, table) => {
  const res = await axios.post(path + '/dbColumns', {
    dsId: dsId,
    search: search,
    table: table
  });

  return res.data;
};
