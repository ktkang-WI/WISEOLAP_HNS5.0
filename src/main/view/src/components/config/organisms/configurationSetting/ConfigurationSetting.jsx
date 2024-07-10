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
  const [general, setGeneral] = useState(generalConfigure?.general);
  const [advanced, setAdvanced] = useState(generalConfigure?.advanced);
  const [menu, setMenu] = useState(generalConfigure?.menu);
  const [report, setReport] = useState(generalConfigure?.report);
  const [page, setPage] = useState(tabItems[0].value);

  const context = {
    state: {
      general: [general, setGeneral],
      advanced: [advanced, setAdvanced],
      menu: [menu, setMenu],
      report: [report, setReport]
    }
  };

  const handleBtnClick = (e) => {
    // 일반 설정 menuConfig Json->string
    generalConfigure.general = general;
    generalConfigure.advanced = advanced;
    generalConfigure.menu = menu;
    generalConfigure.report = report;
    updateGeneralConfig(generalConfigure)
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
