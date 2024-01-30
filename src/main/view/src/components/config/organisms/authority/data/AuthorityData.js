import localizedString from 'config/localization';
import DataAuthority from '../dataAuthority/DataAuthority';
import DatasetAuthority from '../datasetAuthority/DatasetAuthority';
import DatasourceAuthority from '../datasourceAuthority/DatasourceAuthority';
import ReportAuthority from '../reportAuthority/ReportAuthority';
import {groupData, userData} from 'routes/loader/LoaderConfig';

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
    component: ({data}) => <DataAuthority data={data}/>,
    data: groupData
  },
  {
    mode: Mode.GROUPREPORT,
    title: localizedString.groupReport,
    component: <ReportAuthority/>
  },
  {
    mode: Mode.GROUPDATASET,
    title: localizedString.groupDataset,
    component: <DatasetAuthority/>
  },
  {
    mode: Mode.GROUPDATASOURCE,
    title: localizedString.groupDatasource,
    component: <DatasourceAuthority/>
  },
  // 사용자
  {
    mode: Mode.USERDATA,
    title: localizedString.userData,
    component: ({data}) => <DataAuthority data={data}/>,
    data: userData
  },
  {
    mode: Mode.USERREPORT,
    title: localizedString.userReport,
    component: <ReportAuthority/>
  },
  {
    mode: Mode.USERDATASET,
    title: localizedString.userDataset,
    component: <DatasetAuthority/>
  },
  {
    mode: Mode.USERDATASOURCE,
    title: localizedString.userDatasource,
    component: <DatasourceAuthority/>
  }
];
