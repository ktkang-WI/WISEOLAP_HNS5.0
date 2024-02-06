import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button, TabPanel} from 'devextreme-react';
import styled from 'styled-components';
import React, {createContext, useCallback, useEffect, useState} from 'react';
import {Mode, managementData} from './data/ReportFolderManagementData';

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

export const ReportFolderContext = createContext();

const ReportFolderManagement = () => {
  const btns = ['plus', 'save', 'remove', 'edit'];
  const [management, setManagement] = useState(managementData[0]);
  const [data, setData] = useState([]);

  const context = {
    state: {
      data: [data, setData]
    }
  };

  useEffect(() => {
    management.data().then((res) => {
      if (res.data.data) {
        setData(res.data.data);
      }
    });
  }, []);

  const handleBtnClick = ({component}) => {
    alert('기능 개발 중입니다.');
  };

  const navBarItems = () => {
    if (management.mode === Mode.REPORT) {
      return (
        btns.filter((item) => (item !== 'plus' || item !== 'edit'))
            .map((item, index) => (
              <NavBarItem key={index}>
                <Button icon={item} onClick={handleBtnClick}></Button>
              </NavBarItem>
            ))
      );
    } else if (management.mode === Mode.FOLDER) {
      return (
        btns.map((item, index) => (
          <NavBarItem icon={item} key={index}>
            <Button icon={item} onClick={handleBtnClick}></Button>
          </NavBarItem>
        ))
      );
    };
  };

  const handleTabPanelItem = useCallback(({itemData}) => {
    const panelTitle = itemData.title;

    managementData.forEach((item) => {
      if (item.title === panelTitle) {
        item.data().then((res) => {
          if (res.data.data) {
            setManagement(item);
            setData(res.data.data);
          }
        });
        return;
      }
    });
  }, [management, data]);

  return (
    <ReportFolderContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems(management.mode)}
          </NavBar>
        </Header>
        <Content>
          <TabPanel
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={managementData}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={management.component}
            onTitleClick={handleTabPanelItem}
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </ReportFolderContext.Provider>
  );
};

export default React.memo(ReportFolderManagement);
