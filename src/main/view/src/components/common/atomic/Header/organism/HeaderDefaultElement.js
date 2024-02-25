import {EditMode} from 'components/config/configType';
import localizedString from 'config/localization';
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
      'height': '25px',
      'width': '130px'
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
      'label': localizedString.viewer,
      'type': 'TextButton',
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
      'label': localizedString.designer,
      'type': 'TextButton',
      'onClick': (e) => {
        nav('/editds/dashany');
        dispatch(setEditMode(EditMode.VIEWER));
      }
    },
    'DownloadReport': {
      'id': 'downLoadReport',
      'label': localizedString.downloadReport,
      'type': 'TextButton'
    }
  };
};

export default HeaderDefaultElement;
