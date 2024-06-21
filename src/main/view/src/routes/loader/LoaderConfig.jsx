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
  const groupData =
  await models.Authority.getGroupData().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return groupData;
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

export async function authorityLoader() {
  const getData = (res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  };
  // INIT DATA
  const groupAuthData =
    await models.Authority.getGroupData().then((res) => getData(res));
  // GROUP_MSTR
  const groupData =
    await models.UserGroupManagement.getGroups().then((res) => getData(res));
  // USER_MSTR
  const userData =
    await models.Authority.getUsers().then((res) => getData(res));
  // DS_MSTR
  const dataSourceData =
    await models.Authority.getDs().then((res) => getData(res));
  // FOLDER_DATASET
  const folderDataSets =
    await models.Authority.getFolderDatasets().then((res) => getData(res));
  // DS_VIEW
  const dsView =
    await models.Authority.getDsView().then((res) => getData(res));
  // FOLDER_LIST
  const folder =
    await models.ReportFolderManagement.getFolderPubs()
        .then((res) => getData(res));
  const dsViewCube =
    await models.Authority.getDsViewCube().then((res) => getData(res));

  return {
    userData,
    getData,
    groupData,
    groupAuthData,
    dataSourceData,
    folderDataSets,
    dsView,
    folder,
    dsViewCube
  };
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

export async function userDesignerConfig() {
  const data =
  await models.ReportFolderManagement.getUserDesignerConfig().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  });
  return data;
}
