import Header from 'components/common/atomic/Header/organism/Header';
import {DesignerMode, EditMode} from 'components/config/configType';
import ViewerContent from 'components/viewer/ViewerContent';
import useConfig from 'hooks/useConfig';
import useReportLoad from 'hooks/useReportLoad';
import useReportSave from 'hooks/useReportSave';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';

const Viewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  const {getReport, getLinkedReport} = useReportLoad();
  const {querySearch} = useReportSave();

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
    saveConfiguration(generalConfigure, myPageConfigure);
    if (hasFavoritReport) {
      getFavoritViewerReport();
    }
  }, []);

  return (
    <div>
      <Header
        left={['Logo', 'Designer', 'LinkReport', 'ReportTabs']}
        right={['DownloadReport', 'SaveAs', 'UserInfo']}
        // 'ReportProperty' TODO : 추후 추가
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
