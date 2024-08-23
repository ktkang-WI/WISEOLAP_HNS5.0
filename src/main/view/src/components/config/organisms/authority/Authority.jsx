import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import React,
{createContext, useEffect, useMemo, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import DataAuthority from './dataAuthority/DataAuthority';
import DatasetAuthority from './datasetAuthority/DatasetAuthority';
import DatasourceAuthority from './datasourceAuthority/DatasourceAuthority';
import ReportAuthority from './reportAuthority/ReportAuthority';
import {generateAxios, generateGetAxios} from './utils/AuthorityData';
import useModal from 'hooks/useModal';
import _ from 'lodash';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import AddRibbonBtn from 'components/common/atomic/Ribbon/atom/AddRibbonBtn';
import ConfigTabs from '../common/ConfigTabs';
import saveReport from 'assets/image/icon/button/save.png';

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

const tabItems = [
  {
    value: path.GROUP_DATA,
    text: localizedString.groupData,
    props: {
      mainKey: path.GROUP_DATA
    },
    component: DataAuthority
  },
  {
    value: path.GROUP_REPORT,
    text: localizedString.groupReport,
    props: {
      mainKey: path.GROUP_REPORT
    },
    component: ReportAuthority
  },
  {
    value: path.GROUP_DATASET,
    text: localizedString.groupDataset,
    props: {
      mainKey: path.GROUP_DATASET
    },
    component: DatasetAuthority
  },
  {
    value: path.GROUP_DATASOURCE,
    text: localizedString.groupDatasource,
    props: {
      mainKey: path.GROUP_DATASOURCE
    },
    component: DatasourceAuthority
  },
  {
    value: path.USER_DATA,
    text: localizedString.userData,
    props: {
      mainKey: path.USER_DATA
    },
    component: DataAuthority
  },
  {
    value: path.USER_REPORT,
    text: localizedString.userReport,
    props: {
      mainKey: path.USER_REPORT
    },
    component: ReportAuthority
  },
  {
    value: path.USER_DATASET,
    text: localizedString.userDataset,
    props: {
      mainKey: path.USER_DATASET
    },
    component: DatasetAuthority
  },
  {
    value: path.USER_DATASOURCE,
    text: localizedString.userDatasource,
    props: {
      mainKey: path.USER_DATASOURCE
    },
    component: DatasourceAuthority
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
    const prevItemDatas =
      prevItem?.datas?.filter((d) =>
        d.cubeId.length != 0 || d.dsViewDim.length != 0);
    const nextItemDatas =
      nextItem?.datas?.filter((d) =>
        d.cubeId.length != 0 || d.dsViewDim.length != 0);
    return JSON.stringify(prevItemDatas) !==
           JSON.stringify(nextItemDatas);
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
  const [pageReload, setPageReload] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);
  const [action, setAction] = useState(false);
  const {alert} = useModal();

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
    setPageReload((prev) => !prev);
  }, [currentTab]);

  useEffect(() => {
    data[modeData.PREV] = _.cloneDeep(data[modeData.NEXT]);
    setPageReload((prev) => !prev);
  }, [action]);

  const context = {
    state: {
      selected: selected,
      data: data,
      currentTab: [currentTab, setCurrentTab],
      pageReload: pageReload,
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
      console.error(error);
      alert(localizedString.saveFail);
    }
  };

  const bindData = async (path) => {
    try {
      const response = await generateGetAxios(path);
      setInnerData(response.data.data);
      setCurrentTab(path);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <AuthorityContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Wrapper display='flex' direction='column'>
          <ConfigHeader style={{padding: '12px'}}>
            <AddRibbonBtn
              item={{
                'label': localizedString.save,
                'onClick': onAction,
                'imgSrc': saveReport
              }}
            />
          </ConfigHeader>
          <ConfigTabs
            tabItems={tabItems}
            onChangedValue={(path) => {
              if (path == currentTab) return;
              bindData(path);
            }}
            page={currentTab}
          >
          </ConfigTabs>
        </Wrapper>
      </Wrapper>
    </AuthorityContext.Provider>
  );
};

export default React.memo(Authority);
