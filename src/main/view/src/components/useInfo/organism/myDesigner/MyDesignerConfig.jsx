import MyPageDesignerElements from
  'components/useInfo/molcule/myPageDesignerMolecule/MyPageDesignerElements';
import {getTheme} from 'config/theme';
import {useLoaderData} from 'react-router-dom';
import localizedString from 'config/localization';
import {useState} from 'react';
import styled from 'styled-components';
import {resetDesignerConfig, updateDesignerConfig}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import useModal from 'hooks/useModal';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {designerConfigItems} from './MypageDesignerUtil';

const theme = getTheme();

const Content = styled.div`
  height:100%;
  width:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
  margin: 10px;
  border: 1px solid #D4D7DC;
  border-radius: 10px;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
  display: inline-block;
  text-align: left;
  box-sizing: border-box;
`;

const seperateConfig = (designerConfig) => {
  const object = designerConfig;
  // 현재 개인설정 비정형 보고서는 DB에 컬럼이 없어 임시로 Default_Item 컬럼에 저장.
  // TODO: 추후 DB에 개인설정 비정형 보고서 컬럼 생성 하면 바꿀예정.
  if (designerConfig.defaultItem != null) {
    try {
      const toJson = JSON.parse(designerConfig.defaultItem);
      object.defaultItem = toJson.item;
      object.defaultLayout = {check: toJson.check, layout: toJson.layout};
    } catch (e) {
      return object;
    }
  }

  return object;
};

const MyDesignerConfig = () => {
  const designerConfig = useLoaderData();
  const [config, setConfig] = useState(() => seperateConfig(designerConfig));
  const {success, alert, confirm} = useModal();

  const onClickSave = () => {
    const defaultItem = {
      item: config.defaultItem,
      check: config.defaultLayout.check,
      layout: config.defaultLayout.layout
    };

    const saveConfig = {
      ...config,
      defaultItem: JSON.stringify(defaultItem).trim()
    };

    delete saveConfig.defaultLayout;

    updateDesignerConfig(saveConfig).then((response) => {
      if (response.status == 200) {
        success(localizedString.successSave);
      } else {
        alert(localizedString.saveFail);
      }
    });
  };

  const onClickAllReset = () => {
    // reset -> 전부 null로
    confirm(localizedString.resetAllConfirmMsg, () => {
      resetDesignerConfig().then((response) => {
        if (response.status == 200) {
          success(localizedString.resetSuccess);
        } else {
          alert(localizedString.resetFail);
        }
      });
    });
  };

  return (
    <Content>
      <Wrapper>
        <MyPageDesignerElements
          setConfig={setConfig}
          data={config}
          // 각 설정 항목
          items={designerConfigItems}
        />
        <div style={{display: 'flex'}}>
          <CommonButton
            width='200px'
            onClick={onClickSave}
          >
            {localizedString.saveReport}
          </CommonButton>
          <CommonButton
            width='200px'
            onClick={onClickAllReset}
          >
            {localizedString.resetFilter + '(ALL)'}
          </CommonButton>
        </div>
      </Wrapper>
    </Content>
  );
};
export default MyDesignerConfig;
