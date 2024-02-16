import {EditMode} from 'components/config/configType';
import localizedString from 'config/localization';
import openViewerImg from 'assets/image/icon/button/open_viewer.png';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router';
import ConfigSlice from 'redux/modules/ConfigSlice';

const HeaderDefaultElement = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {setEditMode} = ConfigSlice.actions;

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo',
      'height': 'auto',
      'width': '220px'
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
      }
    },
    'ShowQuery': {
      'id': 'show_query',
      'label': localizedString.showQuery,
      'type': 'TextButton'
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
      }
    },
    'DownloadReport': {
      'id': 'designer',
      'label': localizedString.downloadReport,
      'type': 'TextButton'
    }
  };
};

export default HeaderDefaultElement;
