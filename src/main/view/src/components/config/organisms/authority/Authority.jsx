import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button} from 'devextreme-react';
import styled from 'styled-components';
import {authData} from './data/AuthorityData';
import React,
{createContext, useCallback, useEffect, useState} from 'react';
import {getHint} from 'components/config/utility/utility';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import {useLoaderData} from 'react-router-dom';

const Header = styled.div`
  flex: 0 0 50px;
  background-color: #e1e1e1;
`;

const Content = styled.div`
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
  const {groupDataLoader} = useLoaderData();
  const btns = ['save'];
  const [auth, setAuth] = useState(authData[0]);
  const [data, setData] = useState([]);

  const context = {
    state: {
      data: [data, setData]
    }
  };

  useEffect(() => {
    auth.data().then((res) => {
      if (res.data.data) {
        console.log(groupDataLoader);
        setData(res.data.data);
      }
    });
  }, []);

  const navBarItems = () => {
    return (
      btns.map((item, index) => (
        <NavBarItem key={index}>
          <Button
            icon={item}
            hint={getHint(item)}
          />
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
          <CommonTab
            className='dx-theme-background-color'
            width='100%'
            height='80%'
            dataSource={authData}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={auth.component}
            onTitleClick={handleTabPanelItem}
          >
          </CommonTab>
        </Content>
      </Wrapper>
    </AuthorityContext.Provider>
  );
};

export default React.memo(Authority);
