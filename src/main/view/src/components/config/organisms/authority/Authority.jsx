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
import {generateAxios, generateGetAxios} from './data/AuthorityData';

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

export const AuthorityContext = createContext();
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

const Authority = () => {
  const btns = ['save'];
  const {
    userData,
    groupData,
    groupAuthData,
    dataSourceData,
    folderDataSets,
    dsView,
    folder
  } = useLoaderData();
  const [innerData, setInnerData] = useState();
  const [currentTab, setCurrentTab] = useState(null);
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
  }, []);

  useEffect(() => {
    data[modeData.NEXT] = innerData;
  }, [currentTab]);

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
      folder: folder // stationary
    }
  };

  const onAction = async () => {
    await generateAxios(currentTab, data.next);
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
      <Wrapper display='flex' direction='column'>
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
