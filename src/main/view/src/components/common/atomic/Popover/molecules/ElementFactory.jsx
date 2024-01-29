import customChartDefaulElement
  from '../../Ribbon/popover/organism/CustomChartDefaulElement';
import normalChartDefaultElement
  from '../../Ribbon/popover/organism/NormalChartDefaultElement';
import saveDefaultElement
  from '../../Ribbon/popover/organism/SaveDefaultElement';
import downloadDefaultElement
  from '../../Ribbon/popover/organism/DownloadDefaultElement';
import datasetDefaultElement
  from '../../Ribbon/popover/organism/DatasetDefaultElement';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
import {DesignerMode} from 'components/config/configType';
import localizedString from 'config/localization';

const ElementFactory = (id, seriesTypeCompact) => {
  const reportType = selectCurrentDesignerMode(store.getState());
  if (id === 'add_custom_chart') {
    return customChartDefaulElement();
  } else if (id === 'add_default_chart') {
    return normalChartDefaultElement(seriesTypeCompact);
  } else if (id === 'save_report') {
    return saveDefaultElement();
  } else if (id === 'download_report') {
    return downloadDefaultElement();
  } else if (id === 'dataset') {
    if (reportType === DesignerMode['EXCEL']) {
      const elements = datasetDefaultElement();
      const datasets = elements.dataset.filter((element) => element.label ==
        localizedString.addDsSQL || element.label ==
        localizedString.addDsSingle);
      elements.dataset = datasets;
      return elements;
    } else {
      return datasetDefaultElement();
    }
  }
};

export default ElementFactory;
