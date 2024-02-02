import localizedString from 'config/localization';
import DataAuthority from '../dataAuthority/DataAuthority';
import DatasetAuthority from '../datasetAuthority/DatasetAuthority';
import DatasourceAuthority from '../datasourceAuthority/DatasourceAuthority';
import ReportAuthority from '../reportAuthority/ReportAuthority';

import {
  getGroupData,
  getGroupDataset,
  getGroupDs,
  getGroupFolder,
  getUserData,
  getUserDataset,
  getUserDs,
  getUserFolder
}
  from 'models/config/authority/Authority';

export const Mode = {
  GROUP_DATA: 'GROUP_DATA',
  GROUP_REPORT: 'GROUP_REPORT',
  GROUP_DATASET: 'GROUP_DATASET',
  GROUP_DATASOURCE: 'GROUP_DATASOURCE',
  USER_DATA: 'USER_DATA',
  USER_REPORT: 'USER_REPORT',
  USER_DATASET: 'USER_DATASET',
  USER_DATASOURCE: 'USER_DATASOURCE'
};

export const authData = [
  // 그룹
  {
    mode: Mode.GROUP_DATA,
    title: localizedString.groupData,
    component: (auth) => <DataAuthority auth={auth}/>,
    data: getGroupData
  },
  {
    mode: Mode.GROUP_REPORT,
    title: localizedString.groupReport,
    component: (auth) => <ReportAuthority auth={auth}/>,
    data: getGroupFolder
  },
  {
    mode: Mode.GROUP_DATASET,
    title: localizedString.groupDataset,
    component: (auth) => <DatasetAuthority auth={auth}/>,
    data: getGroupDataset
  },
  {
    mode: Mode.GROUP_DATASOURCE,
    title: localizedString.groupDatasource,
    component: (auth) => <DatasourceAuthority auth={auth}/>,
    data: getGroupDs
  },
  // 사용자
  {
    mode: Mode.USER_DATA,
    title: localizedString.userData,
    component: (auth) => <DataAuthority auth={auth}/>,
    data: getUserData
  },
  {
    mode: Mode.USER_REPORT,
    title: localizedString.userReport,
    component: (auth) => <ReportAuthority auth={auth}/>,
    data: getUserFolder
  },
  {
    mode: Mode.USER_DATASET,
    title: localizedString.userDataset,
    component: (auth) => <DatasetAuthority auth={auth}/>,
    data: getUserDataset
  },
  {
    mode: Mode.USER_DATASOURCE,
    title: localizedString.userDatasource,
    component: (auth) => <DatasourceAuthority auth={auth}/>,
    data: getUserDs
  }
];
