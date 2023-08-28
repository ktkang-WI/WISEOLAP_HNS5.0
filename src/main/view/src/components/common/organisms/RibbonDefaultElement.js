import localizedString from '../../../config/localization';
import newReport from '../../../assets/image/icon/button/new.png';
import loadReport from '../../../assets/image/icon/button/load.png';
import saveReport from '../../../assets/image/icon/button/save.png';
import deleteReport from '../../../assets/image/icon/button/crud_remove.png';
import downloadReport
  from '../../../assets/image/icon/button/download_new.png';
import connectReport
  from '../../../assets/image/icon/button/connect_report_add.png';
import addContainer
  from '../../../assets/image/icon/button/insert_container.png';
import addChart from '../../../assets/image/icon/button/add_chart.png';
import addPivotGrid from '../../../assets/image/icon/button/pivot_grid.png';
import addGrid from '../../../assets/image/icon/button/basic_grid.png';
import captionView from '../../../assets/image/icon/button/caption_view.png';
import nameEdit from '../../../assets/image/icon/button/name_edit.png';
import rotate from '../../../assets/image/icon/button/rotate.png';
import xAxisSetting
  from '../../../assets/image/icon/button/x_axis_settings.png';
import yAxisSetting
  from '../../../assets/image/icon/button/y_axis_settings.png';
import showColorLegend
  from '../../../assets/image/icon/button/show_color_legend.png';
import seriesType from '../../../assets/image/icon/button/series_type.png';
import palette from '../../../assets/image/icon/button/global_color.png';
import colorEdit from '../../../assets/image/icon/button/edit_color.png';
import pointLabel from '../../../assets/image/icon/button/point_labels.png';
import querySearch from '../../../assets/image/icon/button/query_search.png';

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
  'SeriesType': {
    'id': 'bar_two',
    'title': localizedString.seriesType,
    'label': localizedString.seriesType,
    'type': 'RibbonButton',
    'imgSrc': seriesType,
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
    'label': localizedString.querySearch,
    'type': 'CommonButton',
    'imgSrc': querySearch,
    'width': 'auto',
    'height': '30px'
  }
};

export default RibbonDefaultElement;
