import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button, TabPanel} from 'devextreme-react';
import styled from 'styled-components';
import {Mode, authData} from './data/AuthorityData';
import React,
{createContext, useCallback, useEffect, useRef, useState} from 'react';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';

const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

const Content = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
`;

const NavBar = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
`;

const NavBarItem = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 30px;
  padding: 0px 3px;
`;

export const AuthorityContext = createContext();

const Authority = () => {
  const {alert} = useModal();

  const btns = ['save'];
  const [auth, setAuth] = useState(authData[0]);
  const [data, setData] = useState([]);

  const groupListRef = useRef();
  const userListRef = useRef();
  const authorityDataCubeRef = useRef();
  const authorityDataDimensionRef = useRef();
  const dsViewListRef = useRef();
  const folderTreeViewRef = useRef();
  const dataSetTreeViewRef = useRef();
  const dataSourceListRef = useRef();

  const context = {
    state: {
      data: [data, setData]
    },
    ref: {
      authorityDataCubeRef: authorityDataCubeRef,
      authorityDataDimensionRef: authorityDataDimensionRef,
      groupListRef: groupListRef,
      userListRef: userListRef,
      dsViewListRef: dsViewListRef,
      folderTreeViewRef: folderTreeViewRef,
      dataSetTreeViewRef: dataSetTreeViewRef,
      dataSourceListRef: dataSourceListRef
    }
  };

  useEffect(() => {
    auth.data().then((res) => {
      if (res.data.data) {
        console.log(res.data.data);
        setData(res.data.data);
      }
    });
  }, []);

  const validationSave = () => {
    if (auth.mode === Mode.GROUP_DATA || auth.mode === Mode.USER_DATA) {
      const groupListSelectedRowKeys =
          groupListRef.current?._instance.option('selectedRowKeys');
      const userListSelectedRowKeys =
          userListRef.current?._instance.option('selectedRowKeys');
      const dsViewListRefSelectedRowKeys =
          dsViewListRef.current._instance.option('selectedRowKeys');

      return (groupListSelectedRowKeys?.length > 0 ||
        userListSelectedRowKeys?.length > 0) &&
      (dsViewListRefSelectedRowKeys.length > 0);
    }

    if (auth.mode === Mode.GROUP_REPORT || auth.mode === Mode.USER_REPORT ||
      auth.mode === Mode.GROUP_DATASET || auth.mode === Mode.USER_DATASET ||
      auth.mode === Mode.GROUP_DATASOURCE ||
      auth.mode === Mode.USER_DATASOURCE) {
      const groupListSelectedRowKeys =
          groupListRef.current?._instance.option('selectedRowKeys');
      const userListSelectedRowKeys =
          userListRef.current?._instance.option('selectedRowKeys');

      return (groupListSelectedRowKeys?.length > 0 ||
        userListSelectedRowKeys?.length > 0);
    }
  };

  const handleBtnClick = ({component}) => {
    if (!validationSave()) {
      alert('데이터를 선택해주세요.');
      return;
    }

    const authorityData = auth.save({groupListRef, userListRef, dsViewListRef,
      authorityDataCubeRef, authorityDataDimensionRef, folderTreeViewRef,
      dataSetTreeViewRef, dataSourceListRef});

    try {
      let prom;
      if (auth.mode === Mode.GROUP_DATA) {
        prom = authorityData.createGroupAuthorityData();
      }
      if (auth.mode === Mode.GROUP_REPORT) {
        prom = authorityData.createGroupAuthorityReport();
      }
      if (auth.mode === Mode.GROUP_DATASET) {
        prom = authorityData.createGroupAuthorityDataSet();
      }
      if (auth.mode === Mode.GROUP_DATASOURCE) {
        prom = authorityData.createGroupAuthorityDataSource();
      }
      if (auth.mode === Mode.USER_DATA) {
        prom = authorityData.createUserAuthorityData();
      }
      if (auth.mode === Mode.USER_REPORT) {
        prom = authorityData.createUserAuthorityReport();
      }
      if (auth.mode === Mode.USER_DATASET) {
        prom = authorityData.createUserAuthorityDataSet();
      }
      if (auth.mode === Mode.USER_DATASOURCE) {
        prom = authorityData.createUserAuthorityDataSource();
      }

      prom.then((response) => {
        if (response.data.data) {
          auth.data().then((res) => {
            if (res.data.data) {
              setData(res.data.data);
              auth.init({authorityDataCubeRef, authorityDataDimensionRef});
              alert(localizedString.successSave);
            }
          });
        }
      });
    } catch (error) {
      console.error('Failed SaveAuthority', error);
    }
  };

  const navBarItems = () => {
    return (
      btns.map((item, index) => (
        <NavBarItem key={index}>
          <Button icon={item} onClick={handleBtnClick}></Button>
        </NavBarItem>
      ))
    );
  };

  const handleTabPanelItem = useCallback(({itemData}) => {
    const panelTitle = itemData.title;

    authData.forEach((item) => {
      if (item.title === panelTitle) {
        item.data().then((res) => {
          if (res.data.data) {
            setAuth(item);
            setData(res.data.data);
          }
        });
        return;
      }
    });
  }, [auth, data]);

  return (
    <AuthorityContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems(auth.mode)}
          </NavBar>
        </Header>
        <Content>
          <TabPanel
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={authData}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={auth.component}
            onTitleClick={handleTabPanelItem}
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </AuthorityContext.Provider>
  );
};

export default React.memo(Authority);
