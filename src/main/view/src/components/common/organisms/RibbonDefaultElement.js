import localizedString from '../../../config/localization';
import newReport from '../../../assets/image/icon/button/ico_new.png';
import loadReport from '../../../assets/image/icon/button/ico_load.png';
import saveReport from '../../../assets/image/icon/button/ico_save.png';
import deleteReport from '../../../assets/image/icon/button/ico_crudRemove.png';
import downloadReport
  from '../../../assets/image/icon/button/ico-download_new.png';
import connectReport
  from '../../../assets/image/icon/button/ico_connectReportAdd.png';
import addContainer
  from '../../../assets/image/icon/button/ico_insert_container.png';
import addChart from '../../../assets/image/icon/button/ico_addChart.png';
import addPivotGrid from '../../../assets/image/icon/button/ico_pivotGrid.png';
import addGrid from '../../../assets/image/icon/button/ico_basicGrid.png';
import captionView from '../../../assets/image/icon/button/ico_captionView.png';
import nameEdit from '../../../assets/image/icon/button/ico_nameEdit.png';
import rotate from '../../../assets/image/icon/button/ico_rotate.png';
import xAxisSetting
  from '../../../assets/image/icon/button/ico_xAxisSettings.png';
import yAxisSetting
  from '../../../assets/image/icon/button/ico_yAxisSettings.png';
import showColorLegend
  from '../../../assets/image/icon/button/ico_showColorLegend.png';
import barTwo from '../../../assets/image/icon/button/ico_bar2.png';
import palette from '../../../assets/image/icon/button/ico_globalColor.png';
import colorEdit from '../../../assets/image/icon/button/ico_editColor.png';
import pointLabel from '../../../assets/image/icon/button/ico_pointLabels.png';
import querySearch from '../../../assets/image/icon/button/ico_querySearch.png';
// import arrowDown from '../../../assets/image/icon/button/ico_arrowDown.png';

const RibbonDefaultElement = {
  'NewReport': {
    id: 'new_report',
    title: localizedString.newReport,
    label: localizedString.newReport,
    type: 'RibbonButton',
    imgSrc: newReport,
    width: 'auto',
    height: '45px'
  },
  'LoadReport': {
    id: 'load_report',
    title: localizedString.loadReport,
    label: localizedString.loadReport,
    type: 'RibbonButton',
    imgSrc: loadReport,
    width: 'auto',
    height: '45px'
  },
  'SaveReport': {
    'id': 'save_report',
    'title': localizedString.saveReport,
    'label': localizedString.saveReport,
    'type': 'RibbonButton',
    'imgSrc': saveReport,
    'width': 'auto',
    'height': '45px'
  },
  'DeleteReport': {
    'id': 'delete_report',
    'title': localizedString.deleteReport,
    'label': localizedString.deleteReport,
    'type': 'RibbonButton',
    'imgSrc': deleteReport,
    'width': 'auto',
    'height': '45px'
  },
  'DownloadReport': {
    'id': 'download_report',
    'title': localizedString.downloadReport,
    'label': localizedString.downloadReport,
    'type': 'RibbonButton',
    'imgSrc': downloadReport,
    'width': 'auto',
    'height': '45px'
  },
  'ConnectReport': {
    'id': 'connect_report',
    'title': localizedString.connectReport,
    'label': localizedString.connectReport,
    'type': 'RibbonButton',
    'imgSrc': connectReport,
    'width': 'auto',
    'height': '45px'
  },
  'AddContainer': {
    'id': 'add_container',
    'title': localizedString.addContainer,
    'label': localizedString.addContainer,
    'type': 'RibbonButton',
    'imgSrc': addContainer,
    'width': 'auto',
    'height': '45px'
  },
  'AddChart': {
    'id': 'add_default_chart',
    'title': localizedString.addChart,
    'label': localizedString.addChart,
    'type': 'RibbonButton',
    'imgSrc': addChart,
    'width': 'auto',
    'height': '45px'
  },
  'AddPivotGrid': {
    'id': 'add_pivotGrid',
    'title': localizedString.addPivotGrid,
    'label': localizedString.addPivotGrid,
    'type': 'RibbonButton',
    'imgSrc': addPivotGrid,
    'width': 'auto',
    'height': '45px'
  },
  'AddGrid': {
    'id': 'add_grid',
    'title': localizedString.addGrid,
    'label': localizedString.addGrid,
    'type': 'RibbonButton',
    'imgSrc': addGrid,
    'width': 'auto',
    'height': '45px'
  },
  'AddCustomChart': {
    'id': 'add_custom_chart',
    'title': localizedString.addCustomChart,
    'label': localizedString.addCustomChart,
    'type': 'RibbonButton',
    'imgSrc': addChart,
    'width': 'auto',
    'height': '45px'
  },
  'CaptionView': {
    'id': 'caption_view',
    'title': localizedString.captionView,
    'label': localizedString.captionView,
    'type': 'RibbonButton',
    'imgSrc': captionView,
    'width': 'auto',
    'height': '45px'
  },
  'NameEdit': {
    'id': 'name_edit',
    'title': localizedString.nameEdit,
    'label': localizedString.nameEdit,
    'type': 'RibbonButton',
    'imgSrc': nameEdit,
    'width': 'auto',
    'height': '45px'
  },
  'Rotate': {
    'id': 'rotate',
    'title': localizedString.rotate,
    'label': localizedString.rotate,
    'type': 'RibbonButton',
    'imgSrc': rotate,
    'width': 'auto',
    'height': '45px'
  },
  'XAxisSetting': {
    'id': 'xAxis_setting',
    'title': localizedString.xAxisSetting,
    'label': localizedString.xAxisSetting,
    'type': 'RibbonButton',
    'imgSrc': xAxisSetting,
    'width': 'auto',
    'height': '45px'
  },
  'YAxisSetting': {
    'id': 'yAxis_setting',
    'title': localizedString.yAxisSetting,
    'label': localizedString.yAxisSetting,
    'type': 'RibbonButton',
    'imgSrc': yAxisSetting,
    'width': 'auto',
    'height': '45px'
  },
  'ExtraAxisSetting': {
    'id': 'extra_setting',
    'title': localizedString.extraAxisSetting,
    'label': localizedString.extraAxisSetting,
    'type': 'RibbonButton',
    'imgSrc': yAxisSetting,
    'width': 'auto',
    'height': '45px'
  },
  'ShowColorLegend': {
    'id': 'show_color_legend',
    'title': localizedString.showColorLegend,
    'label': localizedString.showColorLegend,
    'type': 'RibbonButton',
    'imgSrc': showColorLegend,
    'width': 'auto',
    'height': '45px'
  },
  'BarTwo': {
    'id': 'bar_two',
    'title': localizedString.barTwo,
    'label': localizedString.barTwo,
    'type': 'RibbonButton',
    'imgSrc': barTwo,
    'width': 'auto',
    'height': '45px'
  },
  'Palette': {
    'id': 'palette',
    'title': localizedString.palette,
    'label': localizedString.palette,
    'type': 'RibbonButton',
    'imgSrc': palette,
    'width': 'auto',
    'height': '45px'
  },
  'ColorEdit': {
    'id': 'color_edit',
    'title': localizedString.colorEdit,
    'label': localizedString.colorEdit,
    'type': 'RibbonButton',
    'imgSrc': colorEdit,
    'width': 'auto',
    'height': '45px'
  },
  'PointLabel': {
    'id': 'point_label',
    'title': localizedString.pointLabel,
    'label': localizedString.pointLabel,
    'type': 'RibbonButton',
    'imgSrc': pointLabel,
    'width': 'auto',
    'height': '45px'
  },
  'QuerySearch': {
    'id': 'query_search',
    'title': localizedString.querySearch,
    'label': '',
    'type': 'OnlyImageButton',
    'imgSrc': querySearch,
    'width': 'auto',
    'height': '40px'
  }
  // 'ArrowDown': {
  //   'id': 'arrow_down',
  //   'title': '',
  //   'label': '',
  //   'type': 'RibbonButton',
  //   'imgSrc': arrowDown,
  //   'width': 'auto',
  //   'height': '40px'
  // }
};

export default RibbonDefaultElement;
