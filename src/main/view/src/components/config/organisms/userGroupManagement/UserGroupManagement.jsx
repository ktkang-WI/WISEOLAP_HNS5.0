import {useState} from 'react';
import styled from 'styled-components';
import {Button, TabPanel} from 'devextreme-react';
import {Mode, dataSource} from './data/UserGroupManagementData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';

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

const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

const Content = styled.div`
  height:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
`;

const UserGroupManagement = () => {
  const btns = ['plus', 'save', 'remove', 'key'];
  const [mode, setMode] = useState(Mode.USER);
  const [tabPanelItem, setTabPanelItem] = useState(dataSource[0].component);


  const TabPanelItem = ({children}) => {
    return (
      <>{children}</>
    );
  };

  const navBarItems = (mode) => {
    if (mode === Mode.USER) {
      return (
        btns.map((item, index) => (
          <NavBarItem key={index}>
            <Button icon={item}></Button>
          </NavBarItem>
        ))
      );
    } else if (mode === Mode.GROUP) {
      return (
        btns.filter((item) => item !== 'key')
            .map((item, index) => (
              <NavBarItem icon={item} key={index}>
                <Button icon={item}></Button>
              </NavBarItem>
            ))
      );
    };
  };
  const handleTabPanelItem = (e) => {
    const panelTitle = e.itemData.title;
    dataSource.forEach((item) => {
      if (item.title === panelTitle) {
        setMode(item.mode);
        setTabPanelItem(item.component);
        return;
      }
    });
  };

  return (
    <Wrapper display='flex' direction='column'>
      <Header>
        <NavBar>
          {navBarItems(mode)}
        </NavBar>
      </Header>
      <Content>
        <TabPanel
          className='dx-theme-background-color'
          width='100%'
          height='100%'
          dataSource={dataSource}
          animationEnabled={false}
          swipeEnabled={false}
          onTitleClick={(e) => {
            handleTabPanelItem(e);
          }}
          itemComponent={() => {
            return <TabPanelItem>{tabPanelItem}</TabPanelItem>;
          }}
        >
        </TabPanel>
      </Content>
    </Wrapper>
  );
};

export default UserGroupManagement;
