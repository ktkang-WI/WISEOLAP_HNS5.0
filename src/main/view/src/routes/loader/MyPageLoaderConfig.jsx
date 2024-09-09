import models from 'models';

export async function getUserNmLoader() {
  const data =
    await models.MyPageConfig.getUserNm().then((res) => {
      if (res.status != 200) {
        return res.error;
      }

      return res.data;
    }).catch((e) => {
      console.log(e);
    });

  return data || null;
};
