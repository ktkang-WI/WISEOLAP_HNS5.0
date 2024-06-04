import models from 'models';

export async function generalConfigure() {
  const generalConfigure =
  await models.Preferences.getGeneralConfig().then((res) => {
    if (res.status != 200) {
      return res.error;
    }
    return res.data;
  });
  return {generalConfigure};
}

export async function userGroupManagement() {
  const userGroupManagement =
  await models.UserGroupManagement.getUserGroupManagement().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return {userGroupManagement};
}

export async function groupData() {
  const data =
  await models.Authority.getGroupData().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return data;
}

export async function userData() {
  const data =
  await models.Authority.getUserData().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return data;
}

export async function userFolderData() {
  const data =
  await models.ReportFolderManagement.getMypageFolderReport().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return data;
}
