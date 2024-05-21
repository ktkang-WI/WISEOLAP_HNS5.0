import {EditMode} from 'components/config/configType';
import localizedString from 'config/localization';
import openViewerImg from 'assets/image/icon/button/open_viewer.png';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {checkLinkReport} from 'redux/selector/LinkSelector';
import models from 'models';
import store from 'redux/modules';
import useModal from 'hooks/useModal';
import {getConfig} from 'config/config';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

import useReportSave from 'hooks/useReportSave';
import {selectInitialDisplay} from 'redux/selector/ConfigSelector';
import {useSelector} from 'react-redux';
import {contextPath} from 'routes/Router';
import ViewQuery from '../modal/ViewQuery';


const HeaderDefaultElement = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {alert, openModal} = useModal();
  const initialDisplay = useSelector(selectInitialDisplay);
  const {setEditMode, setDesignerMode} = ConfigSlice.actions;
  const {reload} = useReportSave();

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo',
      'height': 'auto',
      'width': '220px',
      'cursor': 'pointer',
      'onClick': (e) => {
        const href =
          location.href.slice(
              0,
              location.href.indexOf(contextPath) + contextPath.length + 1
          ) + initialDisplay.toLowerCase();
        location.href = href;
      }
    },
    'ReportTab': {
      'id': 'report_tab',
      'type': 'ReportTab',
      'width': 'auto'
    },
    'ReportTabs': {
      'id': 'report_tabs',
      'type': 'ReportTabs',
      'width': 'calc(100% - 130px)'
    },
    'NewWindow': {
      'id': 'new_window',
      'label': localizedString.newWindow,
      'type': 'TextButton',
      'onClick': (e) => {
        window.open('dashany');
      }
    },
    'Viewer': {
      'id': 'viewer',
      'buttonType': 'whiteRound',
      'width': '94px',
      'icon': openViewerImg,
      'label': localizedString.openViewer,
      'type': 'CommonButton',
      'onClick': (e) => {
        nav('viewer');
        dispatch(setEditMode(EditMode.VIEWER));
        reload(initialDisplay);
      }
    },
    'ShowQuery': {
      'id': 'show_query',
      'label': localizedString.showQuery,
      'buttonType': 'whiteRound',
      'width': '94px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        openModal(ViewQuery);
      }
    },
    'ReportSetting': {
      'id': 'report_setting',
      'label': localizedString.reportSetting,
      'type': 'TextButton'
    },
    'ReportProperty': {
      'id': 'report_property',
      'label': localizedString.reportProperty,
      'type': 'TextButton'
    },
    'Designer': {
      'id': 'designer',
      'label': localizedString.openDesigner,
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        nav('/editds/dashany');
        dispatch(setEditMode(EditMode.DESIGNER));
        dispatch(setDesignerMode(initialDisplay));
        reload(initialDisplay);
      }
    },
    'LinkReport': {
      'id': 'linkreport',
      'label': localizedString.linkReport,
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        const linkReport = checkLinkReport(store.getState());
        if (linkReport&& Object.keys(linkReport).length > 0) {
          const firstLinkReportKey = Object.keys(linkReport)[0];
          const firstLinkReport = linkReport[firstLinkReportKey];
          const linkReportId = firstLinkReport.linkReportId;
          const linkReportType = firstLinkReport.linkReportType;
          const tokenSource = {
            userId: 'admin',
            reportId: linkReportId,
            reportType: linkReportType
          };
          models.Report.generateToken(tokenSource).then((res) => {
            const token = res.data.token;
            const urlString =
              `${document.location.origin}${contextRoot}` +
              `/editds/linkViewer?token=${token}`;
            const newWindow = window.open(urlString, '_blank');
            if (newWindow) {
              newWindow.focus();
            }
          }).catch((error) => {
            console.error('Error sending link report:', error);
          });
        } else {
          alert('연결 보고서가 존재하지 않습니다.');
        }
      }
    },
    'DownloadReport': {
      'id': 'downLoadReport',
      'label': localizedString.downloadReport,
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton'
    }
  };
};

export default HeaderDefaultElement;
