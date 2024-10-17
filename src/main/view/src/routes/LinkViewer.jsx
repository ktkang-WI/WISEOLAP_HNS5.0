import Header from 'components/common/atomic/Header/organism/Header';
import {DesignerMode, EditMode} from 'components/config/configType';
import LinkViewerContent from 'components/linkViewer/LinkViewerContent';
import useConfig from 'hooks/useConfig';
import useReportSave from 'hooks/useReportSave';
import {useEffect, useState} from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';
import './portal.css';
import {isPortal} from 'components/utils/PortalUtility';
import {selectMyPageDesignerConfig} from 'redux/selector/ConfigSelector';
import models from 'models';

const LinkViewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;
  const {generalConfigure, myPageConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  saveConfiguration(generalConfigure, myPageConfigure);
  const userMode = useSelector(selectMyPageDesignerConfig);

  const params = new URLSearchParams(window.location.search);
  const noHeader = params.get('no_header') || false;
  const [grpId, setGrpId] = useState(0);

  useEffect(() => {
    models.Report.getUserInfo().then((res) => {
      if (res.status == 200) {
        setGrpId(res.data.grpId);
      }
    });

    dispatch(setEditMode(EditMode.VIEWER));
    reload(DesignerMode.DASHBOARD);
  }, []);
  // 홈앤쇼핑 오픈이후 따로 요청 'LinkReportList'
  const leftItems = ['Logo', 'Portal', 'Designer'];
  let filteredLeftItems =
    (userMode.runMode === 'VIEW' && userMode.grpRunMode === 'VIEW') ?
    leftItems.filter((item) => item !== 'Designer') : leftItems;

  if (grpId == '1503') {
    filteredLeftItems = filteredLeftItems.filter((item) => item !== 'Portal');
  }

  return (
    <div className={isPortal() && 'portal'}>
      {!noHeader &&
        <Header
          left={filteredLeftItems}
          middle={['ReportTab']}
          right={['DownloadReport', 'SaveAs', 'UserInfo']}
        />
      }
      <LinkViewerContent/>
    </div>
  );
};
export default LinkViewer;
