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
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
import {DesignerMode} from 'components/config/configType';
import localizedString from 'config/localization';

const ElementFactory = (id) => {
  const reportType = selectCurrentDesignerMode(store.getState());
  const {saveElement} = saveDefaultElement();

  if (id === 'add_custom_chart') {
    return customChartDefaulElement();
  } else if (id === 'add_default_chart') {
    return nomalChartDefaultElement();
  } else if (id === 'save_report') {
    return saveElement;
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
