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
import querySearchIcon from 'assets/image/icon/report/query_search.png';
import adHocLayoutSetting
  from 'assets/image/icon/button/adHocLayoutSetting.png';
import captionView from 'assets/image/icon/button/caption_view.png';
import nameEdit from 'assets/image/icon/button/name_edit.png';
import inputTxt from 'assets/image/icon/button/inputTxt.png';
import {selectCurrentReport, selectCurrentReportId}
  from 'redux/selector/ReportSelector';
import useLayout from 'hooks/useLayout';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';
import useModal from 'hooks/useModal';
import SimpleInputModal from '../../Modal/organisms/SimpleInputModal';
import LoadReportModal from 'components/report/organisms/Modal/LoadReportModal';
import usePopover from 'hooks/usePopover';
import PopoverUI from '../../Popover/organism/PopoverUI';
import useReportSave from 'hooks/useReportSave';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import itemOptionManager from 'components/report/item/ItemOptionManager';
import store from 'redux/modules';
import {RadioGroup} from 'devextreme-react';
import _ from 'lodash';
import useQueryExecute from 'hooks/useQueryExecute';
import LinkReportModal from
  'components/report/atomic/LinkReport/organisms/LinkReportModal';
import palette from 'assets/image/icon/button/global_color.png';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import Palette from '../../Popover/organism/Palette';
import ColorEditModal from '../../Modal/organisms/ColorEditModal';
import InputTxtModal from '../../Modal/organisms/InputTxtModal';


const RibbonDefaultElement = () => {
  const {
    insertFlexLayout,
    convertCaptionVisible,
    editItemName,
    adHocLayoutUpdate,
    editPalette,
    editColor,
    editMemo
  } = useLayout();
  const {openedPopover} = usePopover();
  const rootItem = useSelector(selectRootItem);
  const reportId = useSelector(selectCurrentReportId);
  const selectedItem = useSelector(selectCurrentItem);
  const designerMode = useSelector(selectCurrentDesignerMode);
  const currentReport = useSelector(selectCurrentReport);
  const {querySearch} = useReportSave();
  const {executeItems} = useQueryExecute();
  const {openModal, confirm, alert} = useModal();
  const {removeReport, reload} = useReportSave();

  // 팝오버가 아닌 일반 리본 버튼 요소, useArrowButton: false가 기본.
  const {
    commonRibbonBtnElement,
    commonPopoverButtonElement
  } = itemOptionManager();

  const data = [
    {id: 'chart', text: '차트만 보기'},
    {id: 'pivot', text: '피벗그리드만 보기'},
    {id: 'chart_pivot', text: '차트, 피벗 전부 보기'}
  ];

  const getPalettePopover = (item) => {
    const palette = item?.meta?.palette;
    return <Palette
      onValueChanged={(e, changedPalette) => {
        if (!(changedPalette?.length !== 0)) {
          console.error('palette is not picked it might be invalid name color');
        }
        editPalette(reportId, selectedItem, changedPalette);
      }}
      palette={palette}
    />;
  };

  const getInputTxtModal = (item) => {
    const memo = item.meta.memo;
    return openModal(InputTxtModal,
        {
          modalTitle: localizedString.inputTxt,
          memo: memo,
          onSubmit: (returnedOptions) => {
            editMemo(reportId, selectedItem, returnedOptions);
          }
        }
    );
  };

  const getColorEditModal = (item) => {
    const measures = getMeasures(item);
    const colorEdit = item.meta.colorEdit;
    return openModal(ColorEditModal,
        {
          modalTitle: localizedString.colorEdit,
          measures: measures,
          colorEdit: colorEdit,
          onSubmit: (returnedOptions) => {
            editColor(reportId, selectedItem, returnedOptions);
          }
        }
    );
  };

  const getMeasures = (item) => {
    if (item.type === 'grid') {
      return item.meta.dataField.field.filter(
          (item) => item.fieldType === 'MEA');
    } else {
      return item.meta.dataField.measure;
    }
  };

  const getRadioPopover = (reportId) => {
    return <RadioGroup
      onValueChanged={(e) => {
        const chartData = rootItem.items[0].mart.data;
        const pivotData = rootItem.items[1].mart.data;

        adHocLayoutUpdate(reportId, e.value);

        if (!_.isEmpty(chartData) || !_.isEmpty(pivotData)) {
          executeItems();
        }
      }}
      valueExpr={'id'}
      displayExpr={'text'}
      value={rootItem.adHocOption.layoutSetting}
      items={data}/>;
  };

  return {
    'NewReport': {
      ...commonRibbonBtnElement,
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
      ...commonRibbonBtnElement,
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
      ...commonRibbonBtnElement,
      'id': 'load_report',
      'label': localizedString.loadReport,
      'imgSrc': loadReport,
      'onClick': (e) => {
        openModal(LoadReportModal);
      }
    },
    'SaveReport': {
      ...commonRibbonBtnElement,
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
      ...commonRibbonBtnElement,
      'id': 'delete_report',
      'label': localizedString.deleteReport,
      'imgSrc': deleteReport,
      'onClick': (afterClick) => {
        const dataSource = _.cloneDeep(currentReport.options);
        const selectedReportId = selectCurrentReportId(store.getState());
        dataSource.reportId = selectedReportId;

        if (selectedReportId !== 0) {
          confirm(localizedString.reportDeleteMsg, () => {
            removeReport(dataSource, afterClick);
          });
        } else {
          alert(localizedString.reportNotDeleteMsg);
        };
      }
    },
    'DownloadReport': {
      ...commonRibbonBtnElement,
      'id': 'download_report',
      'label': localizedString.downloadReport,
      'imgSrc': downloadReport,
      'useArrowButton': true,
      'usePopover': true,
      'onClick': (ref) => {
        const props = {
          width: '500px',
          height: 'auto',
          popoverType: 'subMenuBtn',
          titlePanel: false,
          id: 'download_report'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'ConnectReport': {
      ...commonRibbonBtnElement,
      'id': 'connect_report',
      'label': localizedString.connectReport,
      'imgSrc': connectReport,
      'onClick': (e) => {
        openModal(LinkReportModal, {subYn: false, subLinkDim: null});
      }
    },
    'AdHocLayout': {
      ...commonPopoverButtonElement,
      'id': 'adHoc_layout',
      'label': '비정형 레이아웃',
      'imgSrc': adHocLayoutSetting,
      'renderContent': (e) => {
        const selectedReportId = selectCurrentReportId(store.getState());

        return getRadioPopover(selectedReportId);
      }
    },
    'AddContainer': {
      ...commonRibbonBtnElement,
      'id': 'add_container',
      'label': localizedString.addContainer,
      'imgSrc': addContainer,
      'onClick': (e) => {
        console.log(e);
      }
    },
    'AddChart': {
      ...commonRibbonBtnElement,
      'id': 'add_default_chart',
      'label': localizedString.addChart,
      'imgSrc': addChart,
      'usePopover': true,
      'useArrowButton': true,
      'onClick': (ref) => {
        const props = {
          width: '600px',
          height: 'auto',
          popoverType: 'labelImages',
          titlePanel: true,
          id: 'add_default_chart'
        };
        openedPopover(PopoverUI, props);
      }
    },
    'AddPivotGrid': {
      ...commonRibbonBtnElement,
      'id': 'add_pivotGrid',
      'label': localizedString.addPivotGrid,
      'imgSrc': addPivotGrid,
      'onClick': (e) => {
        const selectedReportId = selectCurrentReportId(store.getState());
        insertFlexLayout(selectedReportId, 'pivot');
      }
    },
    'AddGrid': {
      ...commonRibbonBtnElement,
      'id': 'add_grid',
      'label': localizedString.addGrid,
      'imgSrc': addGrid,
      'onClick': (e) => {
        const selectedReportId = selectCurrentReportId(store.getState());
        insertFlexLayout(selectedReportId, 'grid');
      }
    },
    'AddCustomChart': {
      ...commonRibbonBtnElement,
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
      ...commonRibbonBtnElement,
      'id': 'caption_view',
      'label': localizedString.captionView,
      'imgSrc': captionView,
      'onClick': () => {
        const selectedReportId = selectCurrentReportId(store.getState());
        convertCaptionVisible(selectedReportId, selectedItem);
      }
    },
    'NameEdit': {
      ...commonRibbonBtnElement,
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
    'Palette': {
      ...commonPopoverButtonElement,
      'id': 'palette',
      'label': localizedString.palette,
      'imgSrc': palette,
      'popoverWidth': '500px',
      'renderContent': (e) => {
        return getPalettePopover(selectedItem);
      }
    },
    'ColorEdit': {
      ...commonRibbonBtnElement,
      'id': 'color_edit',
      'label': localizedString.colorEdit,
      'imgSrc': colorEdit,
      'onClick': (e) => {
        // You have to pass dimension and measure list
        return getColorEditModal(selectedItem);
      }
    },
    'InputTxt': {
      ...commonRibbonBtnElement,
      'id': 'input_text',
      'label': localizedString.inputTxt,
      'imgSrc': inputTxt,
      'onClick': (e) => {
        return getInputTxtModal(selectedItem);
      }
    },
    'QuerySearch': {
      'id': 'query_search',
      'label': localizedString.querySearch,
      'type': 'CommonButton',
      'icon': querySearchIcon,
      'width': '83px',
      'height': '30px',
      'useArrowButton': false,
      'onClick': () => {
        querySearch();
      }
    }
  };
};

export default RibbonDefaultElement;
