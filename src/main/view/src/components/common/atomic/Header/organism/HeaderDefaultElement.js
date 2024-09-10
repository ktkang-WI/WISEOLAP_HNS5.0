import {EditMode} from 'components/config/configType';
import localizedString from 'config/localization';
import openViewerImg from 'assets/image/icon/button/open_viewer.png';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
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
import {useSelector} from 'react-redux';
import ViewQuery from '../modal/ViewQuery';
import UserInfoPopover from '../popover/UserInfoPopover';
import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import {exportExcel} from 'components/report/util/ReportDownload';
import {
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {
  selectCurrentInformationas,
  selectCurrentValues
} from 'redux/selector/ParameterSelector';
import {selectCurrentReport,
  selectCurrentReportId} from 'redux/selector/ReportSelector';
import EditReportName from '../modal/EditReportName';
import {getFullUrl} from '../../Location/Location';
import ReportHistoryModal from '../modal/ReportHistory/ReportHistoryModal';
import useSpread from 'hooks/useSpread';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import PopoverUI from '../../Popover/organism/PopoverUI';
import usePopover from 'hooks/usePopover';

const HeaderDefaultElement = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const {
    // alert,
    openModal} = useModal();
  const {setEditMode, setDesignerMode} = ConfigSlice.actions;
  const {reload} = useReportSave();
  const {getWorkbook} = useSpread();

  const userNm = useSelector(selectUserName);
  const initialDisplay = useSelector(selectInitialDisplay);
  const rootItem = useSelector(selectRootItem);
  const currentItem = useSelector(selectCurrentItems);
  const currentParameter = useSelector(selectCurrentInformationas);
  const currentReport = useSelector(selectCurrentReport);
  const reportId = useSelector(selectCurrentReportId);
  const dataSource = _.cloneDeep(currentReport.options);
  const currentParameterValues = useSelector(selectCurrentValues);
  const {openedPopover} = usePopover();

  const filterdLayoutItem = () => {
    if (currentReport.options.reportType === 'Excel') {
      const reportNm =
        currentReport.options.reportNm.replaceAll(/[\s\/\\:*?'<>]/gi, '_');
      return {type: 'excel', name: reportNm};
    };

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
        openModal(EditReportName);
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
    'LinkReport': {
      'id': 'linkreport',
      'label': localizedString.linkReport,
      'buttonType': 'whiteRound',
      'width': '115px',
      'icon': openViewerImg,
      'type': 'CommonButton',
      'onClick': (e) => {
        const props = {
          width: '500px',
          height: 'auto',
          popoverType: 'subMenuBtn',
          titlePanel: false,
          id: 'link_report_list'
        };
        const linkReport = selectLinkedReport(store.getState());
        console.log('linkReport', linkReport);
        if (linkReport&& Object.keys(linkReport).length > 0) {
          openedPopover(PopoverUI, props);
          // const firstLinkReportKey = Object.keys(linkReport)[0];
          // const firstLinkReport = linkReport[firstLinkReportKey];
          // const linkReportId = firstLinkReport.linkReportId;
          // const linkReportType = firstLinkReport.linkReportType;

          // const param = {
          //   reportId: linkReportId,
          //   reportType: linkReportType
          // };

          // connectLinkedReport(param);
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
        // viewer 다운로드 예외 처리(아무것도 없는 경우)
        const editMode = selectEditMode(store.getState());

        if (editMode === EditMode['VIEWER'] && currentReport.reportId === 0) {
          alert(localizedString.viwerDownloadMsg);
          return;
        }

        const newCurrentItem = filterdLayoutItem();

        if (newCurrentItem.type === 'excel') {
          const spread = getWorkbook();

          spread.export((blob) => {
            saveAs(blob, newCurrentItem.name);
          }, () => {
            alert(localizedString.reportCorrupted);
          }, {includeBindingSource: true, fileType: 0});
          return;
        }
        const option = {
          mergeColumn: true,
          mergeRow: true
        };
        exportExcel(
            currentReport,
            newCurrentItem,
            currentParameter,
            currentParameterValues,
            dataSource,
            option
        );
      }
    }
  };
};

export default HeaderDefaultElement;
