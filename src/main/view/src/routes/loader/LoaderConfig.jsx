import models from 'models';

export async function generalConfigure() {
  const generalConfigure =
  await models.Config.getGeneralConfig().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data;
  });
  return {generalConfigure};
}

export async function userGroupManagement() {
  const userGroupManagement =
  await models.Config.getUserGroupManagement().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return {userGroupManagement};
}
