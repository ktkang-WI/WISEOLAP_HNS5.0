
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import MyPageReportForm from 'components/useInfo/molcule/MyPageReportForm';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {updateMyPageReport}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import {useRef, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import {userFolderData} from 'routes/loader/LoaderConfig';
import reportFolderUtility from './ReportFolderUtility';
import MyPageReportList from 'components/useInfo/molcule/MyPageReportList';

const UserReprotManagement = () => {
  const reports = useLoaderData();
  const ref = useRef();
  const [treeViewData, setTreeViewData] = useState(reports);
  const [data, setData] = useState({});
  const [prevName, setPrevName] = useState(null);
  const {confirm, alert, success} = useModal();
  const {checkValidation} = reportFolderUtility();
  const prevNm = prevName;

  const onClickSave = (e) => {
    const report = ref.current?.instance?.option('formData');

    if (!report?.id || report.id === '') {
      alert(localizedString.selectReportAlert);
      return;
    }
    // 변경전 name, 이름 변경 후 검사, 변경 전, 변경 후가 같은 경우는 제외.
    if (prevNm && prevNm !== report?.name) {
    // 변경전과 변경 후 다를 경우 중복검사.
      if (!checkValidation.nameDuple(
          report.name, treeViewData.folderReport
      )) return;
    }

    delete report.datasets;
    delete report.query;
    delete report.datasetXml;

    confirm(localizedString.changeReportNmConfirm, () => {
      updateMyPageReport(report).then((response) => {
        if (!(response.status == 200)) return alert(localizedString.saveFail);

        userFolderData().then((res) => {
          if (!res) return alert(localizedString.saveFail);

          setTreeViewData(res);
          success(localizedString.reportInfoChangeSuccess);
        });

        setData({});
      }).catch((e) => {
        console.log(e);
      });
    });
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Panel
        title={localizedString.report}
        height='100%'
        width='50%'
        padding='10'
      >
        <div style={{width: '100%', height: '50%', textAlign: 'left'}}>
          <MyPageReportList
            data={treeViewData?.folderReport || []}
            setData={setData}
            setTreeViewData={setTreeViewData}
            setPrevName={setPrevName}
            ref={ref}
          />
        </div>
      </Panel>
      <Panel
        title={localizedString.reportInformation}
        height='100%'
        width='50%'
        padding='10'
      >
        <MyPageReportForm
          data={data}
          ref={ref}
          setData={setData}
          myPageFlag={'myPage'}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px'
        }}>
          <CommonButton width={'300px'} onClick={onClickSave}>
            {localizedString.saveReport}
          </CommonButton>
        </div>
      </Panel>
    </Wrapper>
  );
};

export default UserReprotManagement;
