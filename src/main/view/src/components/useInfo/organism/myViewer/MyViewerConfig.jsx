import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import MyPageDesignerElements from
  'components/useInfo/molcule/myPageDesignerMolecule/MyPageDesignerElements';
import localizedString from 'config/localization';
import {useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import {seperateConfig} from '../myDesigner/MyDesignerConfig';
import {updateViewerConfig} from 'models/config/myPage/MyPageConfig';
import useModal from 'hooks/useModal';

const MyViewerConfig = () => {
  const {designerConfig} = useLoaderData();
  const {alert, success, confirm} = useModal();
  const [config, setConfig] = useState(() => seperateConfig(designerConfig));

  const defaultReport = [
    {
      id: {id: 'defaultViewerReportId', requiredNm: 'defaultViewerReportNm'},
      title: '뷰어',
      label: localizedString.defaultReport,
      btnLabel: '설정',
      type: 'favorit'
    }
  ];

  const onClickSave = () => {
    const param = {
      defaultViewerReportId: config.defaultViewerReportId,
      defaultViewerReportNm: config.defaultViewerReportNm,
      reportType: config.reportType
    };

    const result = updateViewerConfig(param).then((res) => {
      return res.status == 200;
    }).catch(() => {
      return false;
    });

    if (result) {
      success(localizedString.successSave);
    } else {
      alert(localizedString.saveFail);
    }
  };

  const onClickAllReset = () => {
    confirm(localizedString.resetAllConfirmMsg, () => {
      setConfig({});
      success(localizedString.resetSuccess);
    });
  };

  return (
    <Wrapper className='custom-scrollbar' overflow='auto'>
      <MyPageDesignerElements
        setConfig={setConfig}
        data={config}
        items={defaultReport}
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
export default MyViewerConfig;
