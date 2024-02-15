import localizedString from 'config/localization';
import DataAuthority from '../dataAuthority/DataAuthority';
import DatasetAuthority from '../datasetAuthority/DatasetAuthority';
import DatasourceAuthority from '../datasourceAuthority/DatasourceAuthority';
import ReportAuthority from '../reportAuthority/ReportAuthority';

import {
  AuthorityData,
  AuthorityDataSet,
  AuthorityDataSource,
  AuthorityReport,
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

const init = ({authorityDataCubeRef, authorityDataDimensionRef, mode}) => {
  if (mode === Mode.GROUP_DATA || mode === Mode.USER_DATA) {
    authorityDataCubeRef.current._instance.clearSelection();
    authorityDataDimensionRef.current._instance.clearSelection();
  }
};

const saveAuthorityData = (ref, dsViewListRef, cubeRef, dimRef, userMode) => {
  const selectedRowKeys = ref.current._instance.option('selectedRowKeys');
  const dsViewId = dsViewListRef.current._instance
      .option('selectedRowKeys')[0]?.dsViewId;
  const cubeList = cubeRef.current._instance
      .option('selectedRowKeys')?.map((row) => ({
        dsViewId: dsViewId,
        cubeId: row
      }));
  const cubeDimList = dimRef.current._instance
      .option('selectedRowKeys')?.map((row) => ({
        dsViewId: dsViewId,
        dimUniNm: row.replace('[', '').replace(']', '')
      }));

  if (userMode === Mode.GROUP_DATA) {
    return new AuthorityData({
      grpId: selectedRowKeys[0]?.grpId,
      cubeList,
      cubeDimList
    });
  } else if (userMode === Mode.USER_DATA) {
    return new AuthorityData({
      userNo: selectedRowKeys[0]?.userNo,
      cubeList,
      cubeDimList
    });
  }
};

const saveAuthorityReport = (ref, folderTreeViewRef, mode) => {
  const selectedRowKeys = ref.current._instance.option('selectedRowKeys');
  const fldList = folderTreeViewRef.current._instance.option('dataSource');

  if (mode === Mode.GROUP_REPORT) {
    return new AuthorityReport({
      grpId: selectedRowKeys[0]?.grpId,
      fldIds: fldList
    });
  }

  if (mode === Mode.USER_REPORT) {
    return new AuthorityReport({
      userNo: selectedRowKeys[0]?.userNo,
      fldIds: fldList
    });
  }
};

const saveAuthorityDataSet = (ref, dataSetTreeViewRef, mode) => {
  const selectedRowKeys = ref.current._instance.option('selectedRowKeys');
  const fldList = dataSetTreeViewRef.current._instance.option('dataSource');

  if (mode === Mode.GROUP_DATASET) {
    return new AuthorityDataSet({
      grpId: selectedRowKeys[0]?.grpId,
      fldId: fldList
    });
  }

  if (mode === Mode.USER_DATASET) {
    return new AuthorityDataSet({
      userNo: selectedRowKeys[0]?.userNo,
      fldId: fldList
    });
  }
};

const saveAuthorityDataSource = (ref, dataSourceListRef, mode) => {
  const selectedRowKeys = ref.current._instance.option('selectedRowKeys');
  const dsIdList = dataSourceListRef.current._instance
      .option('selectedRowKeys');

  if (mode === Mode.GROUP_DATASOURCE) {
    return new AuthorityDataSource({
      grpId: selectedRowKeys[0]?.grpId,
      dsIds: dsIdList
    });
  }

  if (mode === Mode.USER_DATASOURCE) {
    return new AuthorityDataSource({
      userNo: selectedRowKeys[0]?.userNo,
      dsIds: dsIdList
    });
  }
};

export const authData = [
  // 그룹
  {
    mode: Mode.GROUP_DATA,
    title: localizedString.groupData,
    component: DataAuthority,
    data: getGroupData,
    save: ({groupListRef, dsViewListRef,
      authorityDataCubeRef, authorityDataDimensionRef}) =>
      saveAuthorityData(groupListRef, dsViewListRef, authorityDataCubeRef,
          authorityDataDimensionRef, Mode.GROUP_DATA),
    init: ({authorityDataCubeRef, authorityDataDimensionRef}) => {
      const mode = Mode.GROUP_DATA;
      init({authorityDataCubeRef, authorityDataDimensionRef, mode});
    }
  },
  {
    mode: Mode.GROUP_REPORT,
    title: localizedString.groupReport,
    component: ReportAuthority,
    data: getGroupFolder,
    save: ({groupListRef, folderTreeViewRef}) =>
      saveAuthorityReport(groupListRef, folderTreeViewRef, Mode.GROUP_REPORT),
    init: () => {}
  },
  {
    mode: Mode.GROUP_DATASET,
    title: localizedString.groupDataset,
    component: DatasetAuthority,
    data: getGroupDataset,
    save: ({groupListRef, dataSetTreeViewRef}) =>
      saveAuthorityDataSet(groupListRef, dataSetTreeViewRef,
          Mode.GROUP_DATASET),
    init: () => {}
  },
  {
    mode: Mode.GROUP_DATASOURCE,
    title: localizedString.groupDatasource,
    component: DatasourceAuthority,
    data: getGroupDs,
    save: ({groupListRef, dataSourceListRef}) =>
      saveAuthorityDataSource(groupListRef, dataSourceListRef,
          Mode.GROUP_DATASOURCE),
    init: () => {}
  },
  // 사용자
  {
    mode: Mode.USER_DATA,
    title: localizedString.userData,
    component: DataAuthority,
    data: getUserData,
    save: ({userListRef, dsViewListRef, authorityDataCubeRef,
      authorityDataDimensionRef}) =>
      saveAuthorityData(userListRef, dsViewListRef, authorityDataCubeRef,
          authorityDataDimensionRef, Mode.USER_DATA),
    init: ({authorityDataCubeRef, authorityDataDimensionRef}) => {
      const mode = Mode.USER_DATA;
      init({authorityDataCubeRef, authorityDataDimensionRef, mode});
    }
  },
  {
    mode: Mode.USER_REPORT,
    title: localizedString.userReport,
    component: ReportAuthority,
    data: getUserFolder,
    save: ({userListRef, folderTreeViewRef}) =>
      saveAuthorityReport(userListRef, folderTreeViewRef, Mode.USER_REPORT),
    init: () => {}
  },
  {
    mode: Mode.USER_DATASET,
    title: localizedString.userDataset,
    component: DatasetAuthority,
    data: getUserDataset,
    save: ({userListRef, dataSetTreeViewRef}) =>
      saveAuthorityDataSet(userListRef, dataSetTreeViewRef,
          Mode.USER_DATASET),
    init: () => {}
  },
  {
    mode: Mode.USER_DATASOURCE,
    title: localizedString.userDatasource,
    component: DatasourceAuthority,
    data: getUserDs,
    save: ({userListRef, dataSourceListRef}) =>
      saveAuthorityDataSource(userListRef, dataSourceListRef,
          Mode.USER_DATASOURCE),
    init: () => {}
  }
];
