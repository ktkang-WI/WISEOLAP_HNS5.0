import localizedString from 'config/localization';
import newReport from 'assets/image/icon/button/new.png';
import dataset from 'assets/image/icon/button/dataset.png';
import loadReport from 'assets/image/icon/button/load.png';
import saveReport from 'assets/image/icon/button/save.png';
import deleteReport from 'assets/image/icon/button/crud_remove.png';
import downloadReport from 'assets/image/icon/button/download_new.png';
import connectReport from 'assets/image/icon/button/connect_report_add.png';
import addContainer from 'assets/image/icon/button/insert_container.png';
import containerTabHeader
  from 'assets/image/icon/button/container_tab_header.png';
import addChart from 'assets/image/icon/button/add_chart.png';
import addPivotGrid from 'assets/image/icon/button/pivot_grid.png';
import addGrid from 'assets/image/icon/button/basic_grid.png';
import querySearchIcon from 'assets/image/icon/report/query_search.png';
import adHocLayoutSetting
  from 'assets/image/icon/button/adHocLayoutSetting.png';
import addVisualChart
  from 'assets/image/icon/button/visual_chart.png';
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
import {selectCurrentDesignerMode,
  selectMyPageDesignerConfig} from 'redux/selector/ConfigSelector';
import itemOptionManager from 'components/report/item/ItemOptionManager';
import store from 'redux/modules';
import {RadioGroup} from 'devextreme-react';
import useQueryExecute from 'hooks/useQueryExecute';
import LinkReportModal from
  'components/report/atomic/LinkReport/organisms/LinkReportModal';
import palette from 'assets/image/icon/button/global_color.png';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import Palette from '../../Popover/organism/Palette';
import ColorEditModal from '../../Modal/organisms/ColorEditModal';
import InputTxtModal from '../../Modal/organisms/InputTxtModal';
import {AdHocLayoutTypes} from 'components/config/configType';
import {getPalette} from 'devextreme/viz/palette';
import LayoutSlice from 'redux/modules/LayoutSlice';
import {useDispatch} from 'react-redux';
import {selectLinkedReport} from 'redux/selector/LinkSelector';

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
  const mypageConfig = useSelector(selectMyPageDesignerConfig);
  const selectLinkedReportList = useSelector(selectLinkedReport);

  const dispatch = useDispatch();
  const {querySearch} = useReportSave();
  const {executeItems} = useQueryExecute();
  const {openModal, confirm, alert} = useModal();
  const {removeReport, reload} = useReportSave();
  const {toggleTabEnabled, insertContainerTab} = LayoutSlice.actions;

  // 팝오버가 아닌 일반 리본 버튼 요소, useArrowButton: false가 기본.
  const {
    commonRibbonBtnElement,
    commonPopoverButtonElement
  } = itemOptionManager();

  // 비정형 레이아웃 옵션
  const data = localizedString.adHocLayoutOptions;

  const getPalettePopover = (item) => {
    const defaultPalette = {
      name: 'Material',
      caption: '기본값',
      colors: getPalette('Material').simpleSet
    };

    const palette = item?.meta?.palette ?? defaultPalette;
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
    } else if (item.type === 'pie') {
      if (item.meta.colorEdit.length == 0) {
        return item.mart.data.data.map(
            (item, idx) => {
              return {type: 'pie', caption: 'point' + idx};
            }
        );
      }
      return item.meta.colorEdit;
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

        if (_.isEmpty(chartData) && _.isEmpty(pivotData)) {
        } else if (_.isEmpty(chartData) || _.isEmpty(pivotData)) {
          executeItems();
        }
      }}
      valueExpr={'name'}
      displayExpr={'caption'}
      value={rootItem?.adHocOption?.layoutSetting}
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
          let adHocLayout = rootItem;
          const defaultLayout = mypageConfig?.defaultLayout;
          if (adHocLayout.adHocOption) {
            const commonAdHocLayout = adHocLayout.adHocOption.layoutSetting;

            if (defaultLayout?.check) {
              adHocLayout = defaultLayout?.layout;
            } else {
              adHocLayout = AdHocLayoutTypes[commonAdHocLayout];
            }
          }

          adHocLayout = adHocLayout || 'CTGB';

          let defaultItem = 'chart';

          if (mypageConfig?.defaultItem) {
            defaultItem = mypageConfig.defaultItem;
          }

          reload(designerMode, adHocLayout, defaultItem);
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
      'onClick': (props) => {
        const dataSource = _.cloneDeep(currentReport.options);
        const selectedReportId = selectCurrentReportId(store.getState());
        dataSource.reportId = selectedReportId;

        if (selectedReportId !== 0) {
          confirm(localizedString.reportDeleteMsg, () => {
            removeReport(dataSource, props);
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
        if (selectLinkedReportList === null) {
          openModal(
              LinkReportModal,
              {
                subYn: false,
                subLinkDim: null,
                existLinkReports: null
              }
          );
        } else {
          openModal(
              LinkReportModal,
              {
                subYn: false,
                subLinkDim: null,
                existLinkReports: selectLinkedReportList
              }
          );
        }
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
        dispatch(insertContainerTab({reportId}));
      }
    },
    'TabHeaderEnabled': {
      ...commonRibbonBtnElement,
      'id': 'tab_header_enabled',
      'label': localizedString.tabHeaderEnabled,
      'imgSrc': containerTabHeader,
      'onClick': (e) => {
        dispatch(toggleTabEnabled({reportId}));
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
      'imgSrc': addVisualChart,
      'usePopover': true,
      'useArrowButton': true,
      'onClick': (ref) => {
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
      'themeType': (currentReport.options.promptYn === 'N') ?
        'red' : 'secondary',
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
