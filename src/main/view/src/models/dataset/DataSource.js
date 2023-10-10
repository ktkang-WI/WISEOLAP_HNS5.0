import axios from 'axios';

const path = document.location.origin + '/dataset';

export const getByIdAndDsType = async (userId, dsType) => {
  const res = await axios.post(path + '/data-sources', {
    userId: userId,
    dsType: dsType
  });

  return res.data;
};
