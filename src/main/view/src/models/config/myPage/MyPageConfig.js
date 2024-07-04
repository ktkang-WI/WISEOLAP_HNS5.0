import axios from 'axios';

const myPagePath = '/mypage';

// 데이터셋
export const getUserInfomation = () => {
  const res = axios.get(myPagePath + '/user-info');
  return res;
};

export const updatePassword = async (param) => {
  const res = axios.patch(
      myPagePath + '/user-info/update-password', null, {params: param}
  );
  return await res;
};

export const updateUserInfo = (param) => {
  const res = axios.patch(
      myPagePath + '/user-info/update-info', null, {params: param}
  );
  return res;
};
