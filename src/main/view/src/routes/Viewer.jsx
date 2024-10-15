import Header from 'components/common/atomic/Header/organism/Header';
import {DesignerMode, EditMode} from 'components/config/configType';
import ViewerContent from 'components/viewer/ViewerContent';
import useConfig from 'hooks/useConfig';
import useReportLoad from 'hooks/useReportLoad';
import useReportSave from 'hooks/useReportSave';
import models from 'models';
import {useEffect, useState} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {useLoaderData, useNavigate} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {selectMyPageDesignerConfig} from 'redux/selector/ConfigSelector';

const Viewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  const {getReport, getLinkedReport} = useReportLoad();
  const {querySearch} = useReportSave();
  const nav = useNavigate();
  const userMode = useSelector(selectMyPageDesignerConfig);
  const [grpId, setGrpId] = useState(0);

  useEffect(() => {
    models.Report.getUserInfo().then((res) => {
      if (res.status == 200) {
        setGrpId(res.data.grpId);
      }
    });
  }, []);

  const getFavoritViewerReport = async () => {
    const myReportId = myPageConfigure.defaultViewerReportId;
    const myReportType = myPageConfigure.reportType;
    const isLoadReport = await getReport(myReportId, myReportType);
    const isLoadLinkReport = await getLinkedReport(myReportId);

    // TODO: 환경설정 보고서 바로 조회 개발시 분기 예정.
    if (isLoadReport && isLoadLinkReport) {
      querySearch();
    }
  };

  useEffect(() => {
    const hasFavoritReport = myPageConfigure?.defaultViewerReportId;

    dispatch(setEditMode(EditMode.VIEWER));
    reload(DesignerMode.DASHBOARD);
    if (myPageConfigure != undefined && myPageConfigure != '') {
      saveConfiguration(generalConfigure, myPageConfigure);
      if (hasFavoritReport) {
        getFavoritViewerReport();
      }
    } else {
      nav('/editds');
    }
  }, []);
  // 'LinkReport',

  const leftItems = ['Logo', 'Portal', 'Designer', 'ReportTabs'];
  let filteredLeftItems =
    (userMode.runMode === 'VIEW' && userMode.grpRunMode === 'VIEW') ?
    leftItems.filter((item) => item !== 'Designer') : leftItems;

  if (grpId == '1503') {
    filteredLeftItems = filteredLeftItems.filter((item) => item !== 'Portal');
  }

  return (
    <div>
      <Header
        left={filteredLeftItems}
        right={['DownloadReport', 'SaveAs', 'UserInfo']}
        // 'ReportProperty' TODO : 추후 추가
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
