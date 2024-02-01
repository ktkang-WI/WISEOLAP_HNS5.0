import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button, TabPanel} from 'devextreme-react';
import styled from 'styled-components';
import {authData} from './data/AuthorityData';
import {createContext, useCallback, useState} from 'react';
import {useLoaderData} from 'react-router-dom';

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
  const btns = ['save'];
  const [auth, setAuth] = useState(authData[0]);
  const groupData = useLoaderData();

  const [data, setData] = useState(groupData);
  const [report, setReport] = useState();
  const [dataset, setDataset] = useState();
  const [datasource, setDatasource] = useState();

  const context = {
    state: {
      data: [data, setData],
      report: [report, setReport],
      dataset: [dataset, setDataset],
      datasource: [datasource, setDatasource]
    }
  };

  const handleBtnClick = ({component}) => {
    alert('클릭');
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

  const renderItemComponent = useCallback(() => {
    return auth.component(auth);
  }, [auth]);

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
            itemComponent={renderItemComponent}
            onTitleClick={handleTabPanelItem}
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </AuthorityContext.Provider>
  );
};

export default Authority;
