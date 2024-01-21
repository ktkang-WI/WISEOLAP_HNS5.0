import styled from 'styled-components';
import {Button} from 'devextreme-react';
import TabPanel from 'devextreme-react/tab-panel';
import {dataSource} from './data/ConfigurationSettingData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {createContext, useState, useCallback} from 'react';
import {useLoaderData} from 'react-router-dom';
import {updateGeneralConfig} from 'models/config/userGroupManagement.js';
import useModal from 'hooks/useModal.js';

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
  width:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
`;

export const ConfigureContext = createContext();

const ConfigurationSetting = () => {
  const {alert} = useModal();
  const {generalConfigure} = useLoaderData();

  const btns = ['save'];
  const [general, setGeneral] = useState(generalConfigure);

  const context = {
    state: {
      general: [general, setGeneral]
    }
  };

  const TabPanelItem = useCallback(({data}) => {
    return data.component;
  }, [general]);

  const handleBtnClick = (e) => {
    // 일반 설정
    updateGeneralConfig(general).then((res) => {
      if (res.status === 200) {
        console.log(res);
        console.log('환경설정 저장');
        alert('저장 되었습니다.');
      };
    });
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

  return (
    <ConfigureContext.Provider
      value={context}
    >
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems()}
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
            itemComponent={TabPanelItem}
          >
          </TabPanel>
        </Content>,
      </Wrapper>
    </ConfigureContext.Provider>
  );
};

export default ConfigurationSetting;
