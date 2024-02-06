import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {createContext, useEffect, useState} from 'react';
import {Button} from 'devextreme-react';
import styled from 'styled-components';
import models from 'models';
import DataSourceAdditionContent from
  'components/config/molecules/dataSourceAddition/DataSourceAdditionContent';

export const DataSourceAdditionContext = createContext();

const DataSourceAddition = () => {
  const [row, setRow] = useState({});
  const [dataSource, setDataSource] = useState([]);

  const context = {
    state: {
      dataSource: [dataSource, setDataSource],
      row: [row, setRow]
    }
  };

  useEffect(() => {
    console.log('Mount');
    models.Authority.getDsView()
        .then((response) => {
          const newDs = response.data.data.reduce((acc, v) => {
            const dsIdList = acc.map((row) => row.dsId);
            if (!dsIdList.includes(v.dsId)) {
              acc.push(v);
            }
            return acc;
          }, []);
          setDataSource(newDs);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  const btns = ['plus', 'save', 'remove'];

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

  const handleBtnClick = ({component}) => {
    alert('기능 개발 중입니다.');
  };

  const navBarItems = () => {
    return (
      btns.map((item, index) => (
        <NavBarItem icon={item} key={index}>
          <Button icon={item} onClick={handleBtnClick}></Button>
        </NavBarItem>
      ))
    );
  };

  return (
    <DataSourceAdditionContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems()}
          </NavBar>
        </Header>
        <Content>
          <DataSourceAdditionContent/>
        </Content>
      </Wrapper>
    </DataSourceAdditionContext.Provider>
  );
};

export default React.memo(DataSourceAddition);
