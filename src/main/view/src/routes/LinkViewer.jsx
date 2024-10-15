import Header from 'components/common/atomic/Header/organism/Header';
import {DesignerMode, EditMode} from 'components/config/configType';
import LinkViewerContent from 'components/linkViewer/LinkViewerContent';
import useConfig from 'hooks/useConfig';
import useReportSave from 'hooks/useReportSave';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import './portal.css';
import {isPortal} from 'components/utils/PortalUtility';

const LinkViewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  saveConfiguration(generalConfigure, myPageConfigure);

  const params = new URLSearchParams(window.location.search);
  const noHeader = params.get('no_header') || false;

  useEffect(() => {
    dispatch(setEditMode(EditMode.VIEWER));
    reload(DesignerMode.DASHBOARD);
  }, []);
  // 홈앤쇼핑 오픈이후 따로 요청 'LinkReportList'
  return (
    <div className={isPortal() && 'portal'}>
      {!noHeader &&
        <Header
          left={['Logo', 'Portal', 'Designer']}
          middle={['ReportTab']}
          right={['DownloadReport', 'SaveAs', 'UserInfo']}
        />
      }
      <LinkViewerContent/>
    </div>
  );
};
export default LinkViewer;
