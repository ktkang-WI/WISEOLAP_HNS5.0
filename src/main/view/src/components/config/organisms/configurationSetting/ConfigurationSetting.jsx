import {tabItems} from './data/ConfigurationSettingData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {createContext, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import useModal from 'hooks/useModal.js';
import {updateGeneralConfig} from 'models/config/preferences/Preferences.js';
import configureUtility from './ConfigureUtility.js';
import localizedString from 'config/localization';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader.jsx';
import AddRibbonBtn
  from 'components/common/atomic/Ribbon/atom/AddRibbonBtn.jsx';
import saveReport from 'assets/image/icon/button/save.png';
import ConfigTabs from '../common/ConfigTabs.jsx';

export const ConfigureContext = createContext();

const ConfigurationSetting = () => {
  const {alert} = useModal();
  const {generalConfigure} = useLoaderData();
  const {configStringToJson, configJosnToString} = configureUtility();
  const jsonGeneral = configStringToJson(generalConfigure);
  const [general, setGeneral] = useState(jsonGeneral);
  const [page, setPage] = useState(tabItems[0].value);

  const context = {
    state: {
      general: [general, setGeneral]
    }
  };

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
        <ConfigHeader style={{padding: '12px'}}>
          <AddRibbonBtn
            item={{
              'label': localizedString.save,
              'onClick': handleBtnClick,
              'imgSrc': saveReport
            }}
          />
        </ConfigHeader>
        <ConfigTabs
          tabItems={tabItems}
          onChangedValue={setPage}
          page={page}
        >
        </ConfigTabs>
      </Wrapper>
    </ConfigureContext.Provider>
  );
};

export default ConfigurationSetting;
