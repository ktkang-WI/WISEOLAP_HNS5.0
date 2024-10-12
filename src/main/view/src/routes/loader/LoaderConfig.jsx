import models from 'models';

export async function generalConfigure() {
  const generalConfigure =
  await models.Preferences.getGeneralConfig().then((res) => {
    if (res.status != 200) {
      return res.error;
    }
    return res.data;
  }).catch((e) => {
    console.log(e);
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
  }).catch((e) => {
    console.log(e);
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
  }).catch((e) => {
    console.log(e);
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
  }).catch((e) => {
    console.log(e);
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
    await models.Authority.getGroupData().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // GROUP_MSTR
  const groupData =
    await models.UserGroupManagement.getGroups().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // USER_MSTR
  const userData =
    await models.Authority.getUsers().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // DS_MSTR
  const dataSourceData =
    await models.Authority.getDs().then((res) => getData(res)).catch((e) => {
      console.log(e);
    });
  // FOLDER_DATASET
  const folderDataSets =
    await models.Authority.getFolderDatasets().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // DS_VIEW
  const dsView =
    await models.Authority.getDsView().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // FOLDER_LIST
  const folder =
    await models.ReportFolderManagement.getFolderPubs()
        .then((res) => getData(res)).catch((e) => {
          console.log(e);
        });
  // CUBE_MSTR
  const dsViewCube =
    await models.Authority.getDsViewCube().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // DS_VIEW_DIM_MSTR
  const dsViewDim =
    await models.Authority.getDsViewDim().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  // PROG_LIST
  const progList =
    await models.ProgManagement.getProgList().then(
        (res) => getData(res)
    ).catch((e) => {
      console.log(e);
    });
  return {
    userData,
    groupData,
    groupAuthData,
    dataSourceData,
    folderDataSets,
    dsView,
    folder,
    dsViewCube,
    dsViewDim,
    progList
  };
}

export async function userFolderData() {
  const data =
  await models.ReportFolderManagement.getMypageFolderReport().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  }).catch((e) => {
    console.log(e);
  });
  return data || null;
}

export async function userDesignerConfig() {
  const data =
  await models.ReportFolderManagement.getUserDesignerConfig().then((res) => {
    if (res.status != 200) {
      return res.error;
    }

    return res.data.data;
  }).catch((e) => {
    console.log(e);
  });

  const generalLoader = await generalConfigure().then((result) => {
    return result;
  }).catch((e) => {
    console.log(e);
  });

  if (!data) {
    return null; // data가 null이거나 falsy인 경우 null 반환
  }

  return {
    generalConfigure: generalLoader.generalConfigure,
    designerConfig: data
  };
}

export async function myPageUserInfoData() {
  const data =
    await models.MyPageConfig.getUserInfomation().then((res) => {
      if (res.status != 200) {
        return res.error;
      }

      return res.data;
    }).catch((e) => {
      console.log(e);
    });

  return data || null;
}
