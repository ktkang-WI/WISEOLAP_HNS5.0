import localizedString from 'config/localization';
import DataAuthority from '../dataAuthority/DataAuthority';
import DatasetAuthority from '../datasetAuthority/DatasetAuthority';
import DatasourceAuthority from '../datasourceAuthority/DatasourceAuthority';
import ReportAuthority from '../reportAuthority/ReportAuthority';
import {groupData, userData} from 'routes/loader/LoaderConfig';
import {
  getGroupDataset,
  getGroupDs,
  getGroupFolder,
  getUserDataset,
  getUserDs,
  getUserFolder
}
  from 'models/config/authority/Authority';

export const Mode = {
  GROUPDATA: 'GROUPDATA',
  GROUPREPORT: 'GROUPREPORT',
  GROUPDATASET: 'GROUPDATASET',
  GROUPDATASOURCE: 'GROUPDATASOURCE',
  USERDATA: 'USERDATA',
  USERREPORT: 'USERREPORT',
  USERDATASET: 'USERDATASET',
  USERDATASOURCE: 'USERDATASOURCE'
};

export const authData = [
  // 그룹
  {
    mode: Mode.GROUPDATA,
    title: localizedString.groupData,
    component: (auth) => <DataAuthority auth={auth}/>,
    data: groupData
  },
  {
    mode: Mode.GROUPREPORT,
    title: localizedString.groupReport,
    component: (auth) => <ReportAuthority auth={auth}/>,
    data: getGroupFolder
  },
  {
    mode: Mode.GROUPDATASET,
    title: localizedString.groupDataset,
    component: (auth) => <DatasetAuthority auth={auth}/>,
    data: getGroupDataset
  },
  {
    mode: Mode.GROUPDATASOURCE,
    title: localizedString.groupDatasource,
    component: (auth) => <DatasourceAuthority auth={auth}/>,
    data: getGroupDs
  },
  // 사용자
  {
    mode: Mode.USERDATA,
    title: localizedString.userData,
    component: (auth) => <DataAuthority auth={auth}/>,
    data: userData
  },
  {
    mode: Mode.USERREPORT,
    title: localizedString.userReport,
    component: (auth) => <ReportAuthority auth={auth}/>,
    data: getUserFolder
  },
  {
    mode: Mode.USERDATASET,
    title: localizedString.userDataset,
    component: (auth) => <DatasetAuthority auth={auth}/>,
    data: getUserDataset
  },
  {
    mode: Mode.USERDATASOURCE,
    title: localizedString.userDatasource,
    component: (auth) => <DatasourceAuthority auth={auth}/>,
    data: getUserDs
  }
];
