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
import showQuery from 'assets/image/icon/button/showQuery.png';
import saveAsImg from 'assets/image/icon/button/save_rename_header.png';

const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');

import useReportSave from 'hooks/useReportSave';
import {selectInitialDisplay} from 'redux/selector/ConfigSelector';
import {useSelector} from 'react-redux';
import {contextPath} from 'routes/Router';
import ViewQuery from '../modal/ViewQuery';
import UserInfoPopover from '../popover/UserInfoPopover';
import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import {handleDownload} from 'components/report/util/ReportDownload';
import {
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {
  selectCurrentInformationas
} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import EditReportName from '../modal/EditReportName';
// import styled from 'styled-components';


const HeaderDefaultElement = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {alert, openModal} = useModal();
  const initialDisplay = useSelector(selectInitialDisplay);
  const {setEditMode, setDesignerMode} = ConfigSlice.actions;
  const {reload} = useReportSave();
  // TODO: 임시용
  const test = '관리자';

  const rootItem = useSelector(selectRootItem);
  const currentItem = useSelector(selectCurrentItems);
  const currentParameter = useSelector(selectCurrentInformationas);
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);
  const filterdLayoutItem = () => {
    if (!rootItem.adHocOption) return currentItem;

    let items = currentItem.filter((item) =>
      item.type == rootItem.adHocOption.layoutSetting
    );

    if (items.length === 0) { // 차트 피벗 전부 보기인 경우.
      items = currentItem;
    }

    return items;
  };


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
      'width': 'auto',
      'onClick': (e) => {
        openModal(EditReportName);
      }
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
        // TODO: 추후 환경설정으로 새창 여부 분기처리 해야함
        // nav('viewer');
        window.open('viewer');
        dispatch(setEditMode(EditMode.VIEWER));
        reload(initialDisplay);
      }
    },
    'ShowQuery': {
      'id': 'show_query',
      'label': localizedString.showQuery,
      'buttonType': 'onlyImageText',
      'width': '80px',
      'icon': showQuery,
      'type': 'CommonButton',
      'onClick': (e) => {
        openModal(ViewQuery);
      }
    },
    'SaveAs': {
      'id': 'save_as',
      'label': localizedString.saveAs,
      'buttonType': 'whiteRound',
      'width': '140px',
      'icon': saveAsImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        openModal(ReportSaveModal);
      }
    },
    'UserInfo': {
      // 팝오버 속성 설정.
      'popoverProps': {
        'width': 'auto',
        'height': '80',
        'showEvent': 'click',
        'position': 'bottom'
      },
      'id': 'user_info',
      'usePopover': true,
      'label': test, // 임시 적용.
      'buttonType': 'onlyImageText',
      'type': 'CommonButton',
      'contentRender': (e) => {
        return (<UserInfoPopover/>);
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
      'type': 'CommonButton',
      'onClick': (e) => {
        const newCurrentItem = filterdLayoutItem();

        handleDownload(newCurrentItem, currentParameter, dataSource);
      }
    }
  };
};

export default HeaderDefaultElement;
