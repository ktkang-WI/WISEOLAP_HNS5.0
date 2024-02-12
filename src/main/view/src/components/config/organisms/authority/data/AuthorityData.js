import localizedString from 'config/localization';
import DataAuthority from '../dataAuthority/DataAuthority';
import DatasetAuthority from '../datasetAuthority/DatasetAuthority';
import DatasourceAuthority from '../datasourceAuthority/DatasourceAuthority';
import ReportAuthority from '../reportAuthority/ReportAuthority';

import {
  AuthorityData,
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
// import {DsView} from 'models/dataset/DSView';

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
    component: DataAuthority,
    data: getGroupData,
    create: ({groupListRef, dsViewListRef, authorityDataCubeRef,
      authorityDataDimensionRef}) => {
      const groupListSelectedRowKeys =
        groupListRef.current._instance.option('selectedRowKeys');
      const dsViewListRefSelectedRowKeys =
        dsViewListRef.current._instance.option('selectedRowKeys');
      const authorityDataCubeSelectedRowKeys =
        authorityDataCubeRef.current._instance.option('selectedRowKeys');
      const authorityDataDimensionSelectedRowKeys =
        authorityDataDimensionRef.current._instance.option('selectedRowKeys');

      const grpId = groupListSelectedRowKeys[0]?.grpId;
      const dsViewId = dsViewListRefSelectedRowKeys[0]?.dsViewId;
      const cubeList = authorityDataCubeSelectedRowKeys?.map((row) => {
        return {
          dsViewId: dsViewId,
          cubeId: row
        };
      });
      const cubeDimList = authorityDataDimensionSelectedRowKeys?.map((row) => {
        const newRow = row.replace('[', '').replace(']', '');

        return {
          dsViewId: dsViewId,
          dimUniNm: newRow
        };
      });
      return new AuthorityData({grpId, cubeList, cubeDimList});
    }
  },
  {
    mode: Mode.GROUP_REPORT,
    title: localizedString.groupReport,
    component: ReportAuthority,
    data: getGroupFolder
  },
  {
    mode: Mode.GROUP_DATASET,
    title: localizedString.groupDataset,
    component: DatasetAuthority,
    data: getGroupDataset
  },
  {
    mode: Mode.GROUP_DATASOURCE,
    title: localizedString.groupDatasource,
    component: DatasourceAuthority,
    data: getGroupDs
  },
  // 사용자
  {
    mode: Mode.USER_DATA,
    title: localizedString.userData,
    component: DataAuthority,
    data: getUserData,
    create: ({userListRef, dsViewListRef, authorityDataCubeRef,
      authorityDataDimensionRef}) => {
      const userListSelectedRowKeys =
        userListRef.current._instance.option('selectedRowKeys');
      const dsViewListRefSelectedRowKeys =
        dsViewListRef.current._instance.option('selectedRowKeys');
      const authorityDataCubeSelectedRowKeys =
        authorityDataCubeRef.current._instance.option('selectedRowKeys');
      const authorityDataDimensionSelectedRowKeys =
        authorityDataDimensionRef.current._instance.option('selectedRowKeys');

      const userNo = userListSelectedRowKeys[0]?.userNo;
      const dsViewId = dsViewListRefSelectedRowKeys[0]?.dsViewId;

      const cubeList = authorityDataCubeSelectedRowKeys?.map((row) => {
        return {
          dsViewId: dsViewId,
          cubeId: row
        };
      });
      const cubeDimList = authorityDataDimensionSelectedRowKeys?.map((row) => {
        const newRow = row.replace('[', '').replace(']', '');

        return {
          dsViewId: dsViewId,
          dimUniNm: newRow
        };
      });
      return new AuthorityData({userNo, cubeList, cubeDimList});
    }
  },
  {
    mode: Mode.USER_REPORT,
    title: localizedString.userReport,
    component: ReportAuthority,
    data: getUserFolder
  },
  {
    mode: Mode.USER_DATASET,
    title: localizedString.userDataset,
    component: DatasetAuthority,
    data: getUserDataset
  },
  {
    mode: Mode.USER_DATASOURCE,
    title: localizedString.userDatasource,
    component: DatasourceAuthority,
    data: getUserDs
  }
];
