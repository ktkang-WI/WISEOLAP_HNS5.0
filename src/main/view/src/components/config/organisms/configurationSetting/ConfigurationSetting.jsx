import styled from 'styled-components';
import {dataSource} from './data/ConfigurationSettingData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {createContext, useState, useCallback} from 'react';
import {useLoaderData} from 'react-router-dom';
import useModal from 'hooks/useModal.js';
import {updateGeneralConfig} from 'models/config/preferences/Preferences.js';
import CommonTab from
  'components/common/atomic/Common/Interactive/CommonTab.jsx';
import configureUtility from './ConfigureUtility.js';
import localizedString from 'config/localization';
import {
  NavBar,
  navBarItems
} from '../userGroupManagement/common/NavBar.jsx';

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
  const {configStringToJson, configJosnToString} = configureUtility();
  const jsonGeneral = configStringToJson(generalConfigure);
  const btns = ['save'];
  const [general, setGeneral] = useState(jsonGeneral);

  const context = {
    state: {
      general: [general, setGeneral]
    }
  };

  const TabPanelItem = useCallback(({data}) => {
    return data.component;
  }, [general]);

  const handleBtnClick = (e) => {
    // 일반 설정 menuConfig Json->string
    const param = configJosnToString(general);
    updateGeneralConfig(param)
        .then((res) => {
          if (res.status === 200) {
            alert(localizedString.successSave);
          };
        })
        .catch((e) => {
          throw new Error('ConfigurationSetting Data Save Error :' + e);
          alert(localizedString.saveFail);
        });
  };

  return (
    <ConfigureContext.Provider
      value={context}
    >
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems({
              btns: btns,
              onClick: handleBtnClick
            })}
          </NavBar>
        </Header>
        <Content>
          <CommonTab
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={dataSource}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={TabPanelItem}
          >
          </CommonTab>
        </Content>
      </Wrapper>
    </ConfigureContext.Provider>
  );
};

export default ConfigurationSetting;
