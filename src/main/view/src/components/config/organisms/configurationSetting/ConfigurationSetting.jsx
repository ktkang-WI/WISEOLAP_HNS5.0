import {tabItems} from './data/ConfigurationSettingData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {createContext, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import useModal from 'hooks/useModal.js';
import {updateGeneralConfig} from 'models/config/preferences/Preferences.js';
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
  const {general, advanced, menu, report} = generalConfigure || {};
  const [page, setPage] = useState(tabItems[0].value);

  const context = {
    state: {
      general,
      advanced,
      menu,
      report
    }
  };

  const handleBtnClick = (e) => {
    // 일반 설정 menuConfig Json->string
    updateGeneralConfig({general, advanced, menu, report})
        .then((res) => {
          if (res.status === 200) {
            alert(localizedString.successSave);
          };
        })
        .catch((e) => {
          alert(localizedString.saveFail);
          throw new Error('ConfigurationSetting Data Save Error :' + e);
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
