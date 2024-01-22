import localizedString from 'config/localization';
import newReport from 'assets/image/icon/button/new.png';
import dataset from 'assets/image/icon/button/dataset.png';
import loadReport from 'assets/image/icon/button/load.png';
import saveReport from 'assets/image/icon/button/save.png';
import deleteReport from 'assets/image/icon/button/crud_remove.png';
import downloadReport from 'assets/image/icon/button/download_new.png';
import connectReport from 'assets/image/icon/button/connect_report_add.png';
import addContainer from 'assets/image/icon/button/insert_container.png';
import addChart from 'assets/image/icon/button/add_chart.png';
import addPivotGrid from 'assets/image/icon/button/pivot_grid.png';
import addGrid from 'assets/image/icon/button/basic_grid.png';
import captionView from 'assets/image/icon/button/caption_view.png';
import nameEdit from 'assets/image/icon/button/name_edit.png';
import rotate from 'assets/image/icon/button/rotate.png';
import xAxisSetting from 'assets/image/icon/button/x_axis_settings.png';
import yAxisSetting from 'assets/image/icon/button/y_axis_settings.png';
import seriesType from 'assets/image/icon/button/series_type.png';
import inputTxt from 'assets/image/icon/button/inputTxt.png';
import querySearch from 'assets/image/icon/button/query_search.png';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useLayout from 'hooks/useLayout';
import {useSelector} from 'react-redux';
import useQueryExecute from 'hooks/useQueryExecute';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import useModal from 'hooks/useModal';
import SimpleInputModal from '../../Modal/organisms/SimpleInputModal';
import LoadReportModal from 'components/report/organisms/Modal/LoadReportModal';
import usePopover from 'hooks/usePopover';
import PopoverUI from '../../Popover/organism/PopoverUI';
import useReportSave from 'hooks/useReportSave';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import itemOptionManager from 'components/report/item/ItemOptionManager';
import store from 'redux/modules';
import {DesignerMode} from 'components/config/configType';

const RibbonDefaultElement = () => {
  const {insertFlexLayout, convertCaptionVisible, editItemName} = useLayout();
  const {openedPopover} = usePopover();
  const selectedItem = useSelector(selectCurrentItem);
  const designerMode = useSelector(selectCurrentDesignerMode);
  const {executeItems, executeSpread} = useQueryExecute();
  const {openModal, confirm, alert} = useModal();
  const {removeReport, reload} = useReportSave();
  const commonPopoverButton = itemOptionManager().commonPopoverButtonElement;
  // 팝오버가 아닌 일반 리본 버튼 요소, useArrowButton: false가 기본.
  const commonRibbonButton = itemOptionManager().commonRibbonBtnElement;

  return {
    'NewReport': {
      ...commonRibbonButton,
      'id': 'new_report',
      'label': localizedString.newReport,
      'imgSrc': newReport,
      'onClick': () => {
        confirm(localizedString.reloadConfirmMsg, () => {
          reload(designerMode);
        });
      }
    },
    'Dataset': { // 팝오버 버튼으로 추후 교체
      ...commonRibbonButton,
      'id': 'dataset',
      'label': localizedString.dataset,
      'imgSrc': dataset,
      'width': 'auto',
      'usePopover': true,
      'onClick': (ref) => {
        const config = {
          width: 'max-content',
          height: 'auto',
          popoverType: 'onlyTextBtn',
          titlePanel: false,
          id: 'dataset'
        };
        openedPopover(PopoverUI, config);
      }
    },
    'LoadReport': {
      ...commonRibbonButton,
      'id': 'load_report',
      'label': localizedString.loadReport,
      'imgSrc': loadReport,
      'onClick': (e) => {
        openModal(LoadReportModal);
      }
    },
    'SaveReport': {
      ...commonRibbonButton,
      'id': 'save_report',
      'label': localizedString.saveReport,
      'imgSrc': saveReport,
      'useArrowButton': true,
      'usePopover': true,
      'onClick': (ref) => {
        const props = {
          width: 'max-content',
          height: 'auto',
          popoverType: 'onlyTextBtn',
          titlePanel: false,
          id: 'save_report'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'DeleteReport': {
      ...commonRibbonButton,
      'id': 'delete_report',
      'label': localizedString.deleteReport,
      'imgSrc': deleteReport,
      'onClick': () => {
        const selectedReportId = selectCurrentReportId(store.getState());
        const designerMode = selectCurrentDesignerMode(store.getState());
        if (selectedReportId !== 0) {
          confirm(localizedString.reportDeleteMsg, () => {
            removeReport(selectedReportId, designerMode);
          });
        } else {
          alert(localizedString.reportNotDeleteMsg);
        };
      }
    },
    'DownloadReport': {
      ...commonRibbonButton,
      'id': 'download_report',
      'label': localizedString.downloadReport,
      'imgSrc': downloadReport,
      'useArrowButton': true,
      'usePopover': true,
      'onClick': (ref) => {
        const props = {
          width: '200px',
          height: 'auto',
          popoverType: 'subMenuBtn',
          titlePanel: false,
          id: 'download_report'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'ConnectReport': {
      ...commonRibbonButton,
      'id': 'connect_report',
      'label': localizedString.connectReport,
      'imgSrc': connectReport,
      'onClick': (e) => {
      }
    },
    'AddContainer': {
      ...commonRibbonButton,
      'id': 'add_container',
      'label': localizedString.addContainer,
      'imgSrc': addContainer,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'AddChart': {
      ...commonRibbonButton,
      'id': 'add_default_chart',
      'label': localizedString.addChart,
      'imgSrc': addChart,
      'usePopover': true,
      'useArrowButton': true,
      'onClick': (ref) => {
        const props = {
          width: '500px',
          height: 'auto',
          popoverType: 'labelImages',
          titlePanel: true,
          id: 'add_default_chart'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'AddPivotGrid': {
      ...commonRibbonButton,
      'id': 'add_pivotGrid',
      'label': localizedString.addPivotGrid,
      'imgSrc': addPivotGrid,
      'onClick': (e) => {
        const selectedReportId = selectCurrentReportId(store.getState());
        insertFlexLayout(selectedReportId, 'pivot');
      }
    },
    'AddGrid': {
      ...commonRibbonButton,
      'id': 'add_grid',
      'label': localizedString.addGrid,
      'imgSrc': addGrid,
      'onClick': (e) => {
        const selectedReportId = selectCurrentReportId(store.getState());
        insertFlexLayout(selectedReportId, 'grid');
      }
    },
    'AddCustomChart': {
      ...commonRibbonButton,
      'id': 'add_custom_chart',
      'label': localizedString.addCustomChart,
      'imgSrc': addChart,
      'usePopover': true,
      'useArrowButton': true,
      'onClick': (ref) => {
        console.log('AddCustomChart');
        const props = {
          width: '900px',
          height: 'auto',
          popoverType: 'labelImages',
          titlePanel: true,
          id: 'add_custom_chart'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'CaptionView': {
      ...commonRibbonButton,
      'id': 'caption_view',
      'label': localizedString.captionView,
      'imgSrc': captionView,
      'onClick': () => {
        const selectedReportId = selectCurrentReportId(store.getState());
        convertCaptionVisible(selectedReportId, selectedItem);
      }
    },
    'NameEdit': {
      ...commonRibbonButton,
      'id': 'name_edit',
      'label': localizedString.nameEdit,
      'imgSrc': nameEdit,
      'onClick': () => {
        openModal(SimpleInputModal,
            {
              modalTitle: localizedString.nameEdit,
              defaultValue: selectedItem.meta.name,
              onSubmit: (value) => {
                const selectedReportId =
                  selectCurrentReportId(store.getState());
                editItemName(selectedReportId, selectedItem, value);
              }
            }
        );
      }
    },
    'Rotate': {
      ...commonRibbonButton,
      'id': 'rotate',
      'label': localizedString.rotate,
      'imgSrc': rotate,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'XAxisSetting': {
      ...commonRibbonButton,
      'id': 'xAxis_setting',
      'label': localizedString.xAxisSetting,
      'imgSrc': xAxisSetting,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'YAxisSetting': {
      ...commonRibbonButton,
      'id': 'yAxis_setting',
      'label': localizedString.yAxisSetting,
      'imgSrc': yAxisSetting,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'ExtraAxisSetting': {
      ...commonRibbonButton,
      'id': 'extra_setting',
      'label': localizedString.extraAxisSetting,
      'imgSrc': yAxisSetting,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'SeriesType': {
      ...commonPopoverButton,
      'id': 'bar_two',
      'label': localizedString.seriesType,
      'imgSrc': seriesType,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'InputTxt': {
      ...commonRibbonButton,
      'id': 'input_text',
      'label': localizedString.inputTxt,
      'imgSrc': inputTxt,
      'onClick': () => {
      }
    },
    'QuerySearch': {
      'id': 'query_search',
      'label': localizedString.querySearch,
      'type': 'CommonButton',
      'imgSrc': querySearch,
      'width': 'auto',
      'height': '30px',
      'useArrowButton': false,
      'onClick': () => {
        const reportType = selectCurrentDesignerMode(store.getState());
        if (reportType !== DesignerMode['SPREAD_SHEET']) {
          executeItems();
        } else {
          executeSpread();
        }
      }
    }
  };
};

export default RibbonDefaultElement;
