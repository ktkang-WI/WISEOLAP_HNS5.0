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


const ElementFactory = () => {
  const {saveElement} = saveDefaultElement();
  const customChartElement = customChartDefaulElement();
  const normalChartElement = normalChartDefaultElement();
  const downloadElement = downloadDefaultElement();
  const {getDatasetElement} = datasetDefaultElement();

  return {
    'add_custom_chart': customChartElement,
    'add_default_chart': normalChartElement,
    'download_report': downloadElement,
    'dataset': getDatasetElement(),
    'save_report': saveElement
  };

  // if (id === 'add_custom_chart') {
  //   return ;
  // } else if (id === 'add_default_chart') {
  //   return normalChartDefaultElement();
  // } else if (id === 'save_report') {
  //   return saveElement;
  // } else if (id === 'download_report') {
  //   return downloadDefaultElement();
  // } else if (id === 'dataset') {
  //   if (reportType === DesignerMode['EXCEL']) {
  //     const elements = datasetDefaultElement();
  //     const datasets = elements.dataset.filter((element) => element.label ==
  //       localizedString.addDsSQL || element.label ==
  //       localizedString.addDsSingle);
  //     elements.dataset = datasets;
  //     return elements;
  //   } else {
  //     return datasetDefaultElement();
  //   }
  // }
};

export default ElementFactory;
