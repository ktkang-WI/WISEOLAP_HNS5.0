import MyPageDesignerElements from
  'components/useInfo/molcule/myPageDesignerMolecule/MyPageDesignerElements';
import {useLoaderData} from 'react-router-dom';
import localizedString from 'config/localization';
import {useState} from 'react';
import {updateDesignerConfig}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import useModal from 'hooks/useModal';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {designerConfigItems} from './MypageDesignerUtil';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

export const seperateConfig = (designerConfig) => {
  if (designerConfig == null) {
    return {};
  }

  const object = designerConfig;
  // 현재 개인설정 비정형 보고서는 DB에 컬럼이 없어 임시로 Default_Item 컬럼에 저장.
  // TODO: 추후 DB에 개인설정 비정형 보고서 컬럼 생성 하면 바꿀예정.
  if (designerConfig.defaultItem != null) {
    try {
      const toJson = JSON.parse(designerConfig.defaultItem);
      object.defaultItem = toJson.item;
      object.defaultLayout = {
        check: toJson.check, layout: toJson.layout
      };
      object.defaultDisplay = {
        displayCheck: toJson.displayCheck, initDisplay: toJson.initDisplay
      };
    } catch (e) {
      return object;
    }
  }

  if (object.maxReportQueryPeriod) {
    object.maxReportQueryPeriod = JSON.parse(object.maxReportQueryPeriod);
  }

  return object;
};

const MyDesignerConfig = () => {
  const {designerConfig, generalConfigure} = useLoaderData();
  const [config, setConfig] = useState(() => seperateConfig(designerConfig));
  const {success, alert, confirm} = useModal();
  const prog = generalConfigure?.prog;

  // 마이페이지 저장.
  const onClickSave = () => {
    const defaultItem = {
      item: config.defaultItem || '',
      check: config.defaultLayout?.check || false,
      layout: config.defaultLayout?.layout || '',
      displayCheck: config.defaultDisplay?.displayCheck || false,
      initDisplay: config.defaultDisplay?.initDisplay || ''
    };

    const defaultMaxReportQueryPeriod = {
      check: false,
      period: 2
    };

    const saveConfig = {
      ...config,
      defaultItem: JSON.stringify(defaultItem).trim(),
      maxReportQueryPeriod:
        JSON.stringify(
            config.maxReportQueryPeriod || defaultMaxReportQueryPeriod
        ).trim()
    };

    delete saveConfig.defaultLayout;
    delete saveConfig.defaultDisplay;

    updateDesignerConfig(saveConfig).then((response) => {
      if (response.status == 200 && response.data != false) {
        success(localizedString.successSave);
      } else {
        alert(localizedString.saveFail);
      }
    }).catch((e) => {
      console.log(e);
    });
  };

  const onClickAllReset = () => {
    // reset -> 전부 null로
    confirm(localizedString.resetAllConfirmMsg, () => {
      setConfig({operation: 'clearAll'});
      alert(localizedString.resetSuccess);
    });
  };

  return (
    <Wrapper className='custom-scrollbar' overflow='auto'>
      <MyPageDesignerElements
        setConfig={setConfig}
        data={config}
        // 각 설정 항목
        items={designerConfigItems}
        prog={prog}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px'
      }}>
        <CommonButton
          width='100px'
          onClick={onClickSave}
        >
          {localizedString.saveReport}
        </CommonButton>
        <CommonButton
          width='100px'
          onClick={onClickAllReset}
        >
          {localizedString.resetFilter + '(ALL)'}
        </CommonButton>
      </div>
    </Wrapper>
  );
};
export default MyDesignerConfig;
