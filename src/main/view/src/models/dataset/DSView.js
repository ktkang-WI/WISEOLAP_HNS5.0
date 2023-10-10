import axios from 'axios';

const path = document.location.origin + '/dataset';


export const getByUserId = async (userId) => {
  const res = await axios.post(path + '/ds-views', {
    userId: userId
  });

  return res.data;
};
