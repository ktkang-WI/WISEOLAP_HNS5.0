import axios from 'axios';

import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

const path = document.location.origin + contextRoot + '/dataset';

export const getByIdAndDsType = async (userId, dsType) => {
  const res = await axios.post(path + '/data-sources', {
    userId: userId,
    dsType: dsType
  });

  return res.data;
};
