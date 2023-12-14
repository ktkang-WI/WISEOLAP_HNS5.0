import customChartDefaulElement
  from '../../Ribbon/popover/organism/CustomChartDefaulElement';
import nomalChartDefaultElement
  from '../../Ribbon/popover/organism/NomalChartDefaultElement';
import saveDefaultElement
  from '../../Ribbon/popover/organism/SaveDefaultElement';
import downloadDefaultElement
  from '../../Ribbon/popover/organism/DownloadDefaultElement';
import datasetDefaultElement
  from '../../Ribbon/popover/organism/DatasetDefaultElement';

const ElementFactory = (id) => {
  if (id === 'add_custom_chart') {
    return customChartDefaulElement();
  } else if (id === 'add_default_chart') {
    return nomalChartDefaultElement();
  } else if (id === 'save_report') {
    return saveDefaultElement();
  } else if (id === 'download_report') {
    return downloadDefaultElement();
  } else if (id === 'dataset') {
    return datasetDefaultElement();
  }
};

export default ElementFactory;
