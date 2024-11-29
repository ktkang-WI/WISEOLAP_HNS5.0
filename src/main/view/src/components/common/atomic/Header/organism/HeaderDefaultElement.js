import {EditMode} from 'components/config/configType';
import localizedString from 'config/localization';
import openViewerImg from 'assets/image/icon/button/open_viewer.png';
import {useNavigate} from 'react-router';
import ConfigSlice from 'redux/modules/ConfigSlice';
import store from 'redux/modules';
import useModal from 'hooks/useModal';
import showQuery from 'assets/image/icon/button/showQuery.png';
import reportHistory from 'assets/image/icon/button/save_rename_header.png';
import saveAsImg from 'assets/image/icon/button/save_rename_header.png';
import useReportSave from 'hooks/useReportSave';
import {
  selectInitialDisplay,
  selectUserName
} from 'redux/selector/ConfigSelector';
import {useSelector, useDispatch} from 'react-redux';
import ViewQuery from '../modal/ViewQuery';
import UserInfoPopover from '../popover/UserInfoPopover';
import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import {
  selectCurrentItems
} from 'redux/selector/ItemSelector';
import {selectCurrentReport,
  selectCurrentReportId} from 'redux/selector/ReportSelector';
import EditReportName from '../modal/EditReportName';
import {getFullUrl} from '../../Location/Location';
import ReportHistoryModal from '../modal/ReportHistory/ReportHistoryModal';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import LinkReportListDefaultElement
  from '../../Ribbon/popover/organism/LinkReportListDefaultElement';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
import AlertSlice from 'redux/modules/AlertSlice';
import {
  selectAlert
} from 'redux/selector/AlertSelector';
import {useState} from 'react';
import {selectSpread} from 'redux/selector/SpreadSelector';
import elementFactory from '../../Popover/molecules/ElementFactory';
import RibbonPopoverContents
  from '../../Popover/molecules/RibbonPopoverContents';

const HeaderDefaultElement = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {
    alert,
    openModal} = useModal();
  const {setEditMode, setDesignerMode} = ConfigSlice.actions;
  const {reload} = useReportSave();

  const userNm = useSelector(selectUserName);
  const initialDisplay = useSelector(selectInitialDisplay);
  const currentReport = useSelector(selectCurrentReport);
  const reportId = useSelector(selectCurrentReportId);
  const editMode = useSelector(selectEditMode);
  const dataSource = _.cloneDeep(currentReport.options);
  const currentParameterValues = useSelector(selectCurrentValues);
  const selectLinkedReportList = useSelector(selectLinkedReport);
  const {
    showAlert,
    resetAlert
  } = AlertSlice.actions;
  const isAlertShown = useSelector(selectAlert);
  const [showLinkedReport, setShowLinkedReport] = useState(false); // 상태 관리

  const element = elementFactory();

  return {
    'Logo': {
      'id': 'logo',
      'type': 'Logo',
      'height': 'auto',
      'width': '130px',
      'cursor': 'pointer',
      'onClick': (e) => {
        const href = `${getFullUrl()}/${initialDisplay.toLowerCase()}`;
        location.href = href;
      }
    },
    'ReportTab': {
      'id': 'report_tab',
      'type': 'ReportTab',
      'width': 'auto',
      'onClick': (e) => {
        if (editMode !== EditMode['VIEWER']) {
          openModal(EditReportName);
        }
      }
    },
    'ReportTabs': {
      'id': 'report_tabs',
      'type': 'ReportTabs',
      'width': 'calc(100vw - 130px)'
    },
    'NewWindow': {
      'id': 'new_window',
      'label': localizedString.newWindow,
      'type': 'TextButton',
      'onClick': (e) => {
        window.open(`${getFullUrl()}/dashany`);
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
        window.open(`${getFullUrl()}/viewer`);
        // dispatch(setEditMode(EditMode.VIEWER));
      }
    },
    'ReportSearch': {
      'id': 'report_search',
      'type': 'DropdownBox',
      'button': [{
        name: 'reportSearch',
        location: 'after',
        options: {
          visible: true,
          stylingMode: 'text',
          icon: 'search',
          type: 'default',
          disabled: true
        }
      }]
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
    'ReportHistory': {
      'id': 'report_history',
      'label': localizedString.reportHistory.reportHistory,
      'buttonType': 'onlyImageText',
      'width': '120px',
      'icon': reportHistory,
      'type': 'CommonButton',
      'onClick': (e) => {
        if (reportId) {
          openModal(ReportHistoryModal);
        }
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
        // TODO : linkViewer 방식이 변경 되면 다시 고려 해야함.
        const items = selectCurrentItems(store.getState());
        const spreadData = selectSpread(store.getState());
        const isOpenAndExcute = items.some((i) => i.mart.init);
        if (isOpenAndExcute) {
          openModal(ReportSaveModal);
        } else if (Object.keys(spreadData.meta.bindingInfos).length > 0) {
          openModal(ReportSaveModal);
        } else {
          alert('보고서를 조회한 후 저장해 주세요.');
        }
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
      'id': 'user_info_popover',
      'usePopover': true,
      'label': userNm,
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
    'Portal': {
      'id': 'portal',
      'label': '메인화면 열기',
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        nav('/editds/portal');
      }
    },
    'LinkReportList': {
      'id': 'linkreport',
      'label': localizedString.linkReport,
      'icon': openViewerImg,
      'buttonType': 'whiteRound',
      'width': '115px',
      'type': 'CommonButton',
      'popoverProps': {
        'width': 'auto',
        'height': 'auto',
        'showEvent': 'click',
        'position': 'bottom'
      },
      'usePopover': true,
      'onClick': (e) => {
        // 조건을 만족하면 LinkReportListDefaultElement 렌더링
        if (Object.keys(selectLinkedReportList).length > 0) {
          setShowLinkedReport(true); // 상태를 true로 설정
        } else {
          setShowLinkedReport(false); // 상태 초기화
          if (currentReport.reportId === 0 && !isAlertShown) {
            alert(localizedString.NoReportNoLinkReport);
            dispatch(showAlert());
            dispatch(resetAlert());
            return;
          }
          if (Object.keys(selectLinkedReportList).length === 0 &&
              !isAlertShown) {
            alert(localizedString.yesReportNoLinkReport);
            dispatch(showAlert());
            dispatch(resetAlert());
            return;
          }
        }
      },
      'contentRender': (e) => {
        if (showLinkedReport &&
            Object.keys(selectLinkedReportList).length > 0) {
          return (
            <LinkReportListDefaultElement />
          );
        }
        return;
      }
    },
    'DownloadReport': {
      'id': 'downLoadReport',
      'label': localizedString.downloadReport,
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'usePopover': true,
      'popoverProps': {
        'width': 'auto',
        'height': 'auto',
        'showEvent': 'click',
        'position': 'bottom',
        'wrapperAttr': {id: 'viewerDownloadPopover'}
      },
      'contentRender': (e) => {
        if (editMode === EditMode['VIEWER'] && currentReport.reportId === 0) {
          return;
        }

        const props = {
          width: '400px',
          height: 'auto',
          popoverType: 'labelImages',
          titlePanel: false,
          id: 'download_report'
        };

        return (
          <RibbonPopoverContents
            element={element[props.id]}
            {...props}/>
        );
      },
      'onClick': (e) => {
        // viewer 다운로드 예외 처리(아무것도 없는 경우)
        if (editMode === EditMode['VIEWER'] && currentReport.reportId === 0) {
          alert(localizedString.viwerDownloadMsg);
          return;
        }
      }
    }
  };
};

export default HeaderDefaultElement;
