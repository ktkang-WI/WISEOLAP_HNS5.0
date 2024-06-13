// import Header from 'components/common/atomic/Header/organism/Header';
import MyPageDesignerElements
  from 'components/useInfo/molcule/MyPageDesignerElements';
import {getTheme} from 'config/theme';
import {useLoaderData} from 'react-router-dom';
import {useState} from 'react';
import styled from 'styled-components';
// import models from 'models';
import {resetDesignerConfig, updateDesignerConfig}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import useModal from 'hooks/useModal';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';

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

const items = [
  // {id: 'defaultDatasetId', title: '기본 데이터 집합', label: '즐겨찾기'},
  {id: 'defaultReportId', title: '기본 보고서', label: '즐겨찾기'},
  {id: 'defaultItem', title: '기본 아이템', label: '즐겨찾기'},
  {id: 'defaultPalette', title: '기본 색상', label: '즐겨찾기'},
  {id: 'defaultLayout', title: '비정형 보고서 설정'}
];

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
        success('저장 성공');
      } else {
        alert('저장 실패');
      }
    });
  };

  const onClickAllReset = () => {
    // reset -> 전부 null로
    confirm('설정한 모든 항목이 초기화 됩니다. 진행 하시겠습니까?', () => {
      resetDesignerConfig().then((response) => {
        if (response.status == 200) {
          success('초기화 완료');
        } else {
          alert('초기화 실패');
        }
      });
    });
  };

  return (
    <Content>
      <Wrapper>
        <MyPageDesignerElements
          setConfig={setConfig} data={config} items={items}/>
        <div style={{display: 'flex'}}>
          <CommonButton
            width='200px'
            onClick={onClickSave}
          >저장</CommonButton>
          <CommonButton
            width='200px'
            onClick={onClickAllReset}
          >초기화(ALL)</CommonButton>
        </div>
      </Wrapper>
    </Content>
  );
};
export default MyDesignerConfig;
