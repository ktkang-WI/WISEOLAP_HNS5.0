import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import React,
{createContext, useEffect, useMemo, useState} from 'react';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import {
  Header,
  NavBar,
  navBarItems} from '../userGroupManagement/common/NavBar';
import {useLoaderData} from 'react-router-dom';
import DataAuthority from './dataAuthority/DataAuthority';
import DatasetAuthority from './datasetAuthority/DatasetAuthority';
import DatasourceAuthority from './datasourceAuthority/DatasourceAuthority';
import ReportAuthority from './reportAuthority/ReportAuthority';
import {generateAxios, generateGetAxios} from './utils/AuthorityData';
import useModal from 'hooks/useModal';
import _ from 'lodash';

export const AuthorityContext = createContext();
export const path = {
  'GROUP_DATA': '/account/group/data',
  'GROUP_REPORT': '/account/group/folder',
  'GROUP_DATASET': '/account/group/dataset',
  'GROUP_DATASOURCE': '/account/group/ds',
  'USER_DATA': '/account/user/data',
  'USER_REPORT': '/account/user/folder',
  'USER_DATASET': '/account/user/dataset',
  'USER_DATASOURCE': '/account/user/ds'
};

export const mode = {
  'GROUP': 'group',
  'USER': 'user'
};

export const modeData = {
  'PREV': 'prev',
  'NEXT': 'next'
};

const dataSource = [
  {
    path: path.GROUP_DATA,
    title: localizedString.groupData,
    component: <DataAuthority mainKey={path.GROUP_DATA}/>
  },
  {
    path: path.GROUP_REPORT,
    title: localizedString.groupReport,
    component: <ReportAuthority mainKey={path.GROUP_REPORT}/>
  },
  {
    path: path.GROUP_DATASET,
    title: localizedString.groupDataset,
    component: <DatasetAuthority mainKey={path.GROUP_DATASET}/>
  },
  {
    path: path.GROUP_DATASOURCE,
    title: localizedString.groupDatasource,
    component: <DatasourceAuthority mainKey={path.GROUP_DATASOURCE}/>
  },
  {
    path: path.USER_DATA,
    title: localizedString.userData,
    component: <DataAuthority mainKey={path.USER_DATA}/>
  },
  {
    path: path.USER_REPORT,
    title: localizedString.userReport,
    component: <ReportAuthority mainKey={path.USER_REPORT}/>
  },
  {
    path: path.USER_DATASET,
    title: localizedString.userDataset,
    component: <DatasetAuthority mainKey={path.USER_DATASET}/>
  },
  {
    path: path.USER_DATASOURCE,
    title: localizedString.userDatasource,
    component: <DatasourceAuthority mainKey={path.USER_DATASOURCE}/>
  }
];

const getStringFy = (prevItem, nextItem, currentTab) => {
  if (currentTab == path.USER_DATASET ||
      currentTab == path.GROUP_DATASET) {
    return JSON.stringify(prevItem?.fldId) !==
           JSON.stringify(nextItem?.fldId);
  } else if (
    currentTab == path.USER_DATASOURCE ||
    currentTab == path.GROUP_DATASOURCE) {
    return JSON.stringify(prevItem?.dsIds) !==
           JSON.stringify(nextItem?.dsIds);
  } else if (
    currentTab == path.GROUP_DATA ||
    currentTab == path.USER_DATA
  ) {
    return JSON.stringify(prevItem?.datas) !==
           JSON.stringify(nextItem?.datas);
  } else if (
    currentTab === path.USER_REPORT ||
    currentTab == path.GROUP_REPORT
  ) {
    return JSON.stringify(prevItem?.fldIds) !==
           JSON.stringify(nextItem?.fldIds);
  }
};

export const getFindDifferentIds = (currentTab, data) => {
  const result = new Set();
  const prev = getUserGroupKeys(currentTab, data);
  const next = getUserGroupNextKeys(currentTab, data);
  const prevIds = prev.map((d) => (d.grpId || d.userNo));
  const nextIds = next.map((d) => (d.grpId || d.userNo));

  nextIds.forEach((id) => {
    if (!prevIds.includes(id)) {
      result.add(id);
    }
  });

  prev.forEach((prevItem) => {
    const nextItem = next.find((item) =>
      (item.grpId || item.userNo) === (prevItem.grpId || prevItem.userNo));
    const isOk = getStringFy(prevItem, nextItem, currentTab);
    if (isOk) {
      result.add((prevItem.grpId || prevItem.userNo));
    }
  });
  return [...result];
};
export const getUserGroupNextKeys = (currentTab, data) => {
  let result = null;
  if (currentTab == path.USER_REPORT || currentTab == path.GROUP_REPORT) {
    result = data.next.filter((d) => {
      return d.fldIds.some((f) => Object.values(f).includes(true));
    });
  } else if (
    currentTab == path.USER_DATASOURCE ||
    currentTab == path.GROUP_DATASOURCE) {
    result = data.next.filter((d) => d.dsIds.length > 0);
  } else if (
    currentTab == path.USER_DATASET ||
    currentTab == path.GROUP_DATASET) {
    result = data.next.filter((d) => d.fldId.length > 0);
  } else if (
    currentTab == path.GROUP_DATA ||
    currentTab == path.USER_DATA
  ) {
    result = data.next.filter((d) => {
      const sizeIsOk = d.datas.length > 0;
      const isOk = d.datas.some((cube) => {
        const cubeId = cube?.cubeId?.length ?? 0 != 0;
        const dsViewDim = cube?.dsViewDim?.length ?? 0 != 0;
        return cubeId || dsViewDim;
      });
      return sizeIsOk && isOk;
    });
  } else {
    result = [];
  }
  return result;
};
export const getUserGroupKeys = (currentTab, data) => {
  let result = null;
  if (currentTab == path.USER_REPORT || currentTab == path.GROUP_REPORT) {
    result = data.prev.filter((d) => {
      return d.fldIds.some((f) => Object.values(f).includes(true));
    });
  } else if (
    currentTab == path.USER_DATASOURCE ||
    currentTab == path.GROUP_DATASOURCE) {
    result = data.prev.filter((d) => d.dsIds.length > 0);
  } else if (
    currentTab == path.USER_DATASET ||
    currentTab == path.GROUP_DATASET) {
    result = data.prev.filter((d) => d.fldId.length > 0);
  } else if (
    currentTab == path.GROUP_DATA ||
    currentTab == path.USER_DATA
  ) {
    result = data.prev.filter((d) => {
      const sizeIsOk = d.datas.length > 0;
      const isOk = d.datas.some((cube) => {
        const cubeId = cube?.cubeId?.length ?? 0 != 0;
        const dsViewDim = cube?.dsViewDim?.length ?? 0 != 0;
        return cubeId || dsViewDim;
      });
      return sizeIsOk && isOk;
    });
  } else {
    result = [];
  }
  return result;
};
export const getKeys = (condition, selected) => {
  let prevId;
  let nextId;
  let isPrevKey;
  if (condition == mode.GROUP) {
    prevId = selected?.group?.prev?.grpId;
    nextId = selected?.group?.next?.grpId;
    isPrevKey = (d) => d.group.grpId === prevId;
  } else if (condition == mode.USER) {
    prevId = selected?.user?.prev?.userNo;
    nextId = selected?.user?.next?.userNo;
    isPrevKey = (d) => d.user.userNo === prevId;
  }
  return {prevId, nextId, isPrevKey};
};
export const getUserOrGroup = (dataSetMode, data, nextId) => {
  return data?.next?.find((d) => {
    if (dataSetMode === mode.GROUP) {
      return d?.grpId == nextId;
    } else if (dataSetMode === mode.USER) {
      return d?.userNo == nextId;
    }
  });
};
export const getUserOrGroupOrigin = (dataSetMode, data, nextId) => {
  return data?.prev?.find((d) => {
    if (dataSetMode === mode.GROUP) {
      return d?.grpId == nextId;
    } else if (dataSetMode === mode.USER) {
      return d?.userNo == nextId;
    }
  });
};
export const getUserOrGroupOriginNext = (dataSetMode, data, nextId) => {
  return data?.next?.find((d) => {
    if (dataSetMode === mode.GROUP) {
      return d?.grpId == nextId;
    } else if (dataSetMode === mode.USER) {
      return d?.userNo == nextId;
    }
  });
};

export const getDataObjectOfUserOrGroup = (dataSetMode, comparisonKey) => {
  return {
    ...(dataSetMode === mode.GROUP ? {grpId: comparisonKey} : {}),
    ...(dataSetMode === mode.USER ? {userNo: comparisonKey} : {})
  };
};

const Authority = () => {
  const btns = ['save'];
  const {
    userData,
    groupData,
    groupAuthData,
    dataSourceData,
    folderDataSets,
    dsView,
    folder,
    dsViewCube,
    dsViewDim
  } = useLoaderData();
  const [innerData, setInnerData] = useState();
  const [currentTab, setCurrentTab] = useState(null);
  const [action, setAction] = useState(false);
  const {alert} = useModal();
  const TabPanelItem = ({data}) => {
    return data.component;
  };

  const selected = useMemo(() => ({
    [mode.GROUP]: {
      prev: null,
      next: null
    },
    [mode.USER]: {
      prev: null,
      next: null
    }
  }), [currentTab]);

  const data = useMemo(() => ({
    [modeData.PREV]: null,
    [modeData.NEXT]: null
  }), [currentTab]);

  // init data
  useEffect(() => {
    setInnerData(groupAuthData);
    setCurrentTab(path.GROUP_DATA);
    data[modeData.NEXT] = groupAuthData;
  }, []);

  useEffect(() => {
    data[modeData.NEXT] = innerData;
    data[modeData.PREV] = _.cloneDeep(innerData);
  }, [currentTab]);

  useEffect(() => {
    data[modeData.PREV] = _.cloneDeep(data[modeData.NEXT]);
  }, [action]);

  const context = {
    state: {
      selected: selected,
      data: data,
      currentTab: [currentTab, setCurrentTab],
      user: userData, // stationary
      group: groupData, // stationary
      dataSourceData: dataSourceData, // stationary
      folderDataSets: folderDataSets, // stationary
      dsView: dsView, // stationary
      folder: folder, // stationary
      dsViewCube: dsViewCube,
      dsViewDim: dsViewDim,
      action: [action]
    }
  };

  const onAction = async () => {
    try {
      const response = await generateAxios(currentTab, data.next);
      if (response.data.data) {
        alert(localizedString.successSave);
      }
      setAction((prev) => !prev);
    } catch (error) {
      alert(localizedString.saveFail);
    }
  };

  const bindData = async (e) => {
    try {
      const response = await generateGetAxios(e?.itemData?.path);
      setInnerData(response.data.data);
      setCurrentTab(e?.itemData?.path);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <AuthorityContext.Provider
      value={context}>
      <Wrapper display='flex' direction='row'>
        <Header>
          <NavBar>
            {navBarItems({
              btns: btns,
              onClick: onAction
            })}
          </NavBar>
        </Header>
        <Wrapper>
          <CommonTab
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={dataSource}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={TabPanelItem}
            onTitleClick={bindData}
          >
          </CommonTab>
        </Wrapper>
      </Wrapper>
    </AuthorityContext.Provider>
  );
};

export default React.memo(Authority);
