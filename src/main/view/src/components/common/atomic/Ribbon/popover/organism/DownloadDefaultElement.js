import localizedString from 'config/localization';
import store from 'redux/modules';
import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import models from 'models';
import PivotGrid from 'devextreme/ui/pivot_grid';
import DataGrid from 'devextreme/ui/data_grid';
// import Chart from 'devextreme/viz/chart';
// import PieChart from 'devextreme/viz/pie_chart';
// import {Workbook} from 'exceljs';
// import saveAs from 'file-saver';
// import {exportPivotGrid, exportDataGrid} from 'devextreme/excel_exporter';

const DownloadDefaultElement = () => {
  const items = selectCurrentItems(store.getState());
  const parameters = selectRootParameter(store.getState());
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);
  const downloadAllSet = {items, parameters, dataSource};
  console.log('downloadAllSet', downloadAllSet);
  const handleDownload = async () => {
    const dataPromises = items.map((item) => {
      const element = document.getElementById(item.id);
      if (!element) return null;
      let instance;
      switch (item.type) {
        case 'pivot':
          instance = PivotGrid.getInstance(element);
          break;
        case 'grid':
          instance = DataGrid.getInstance(element);
          break;
        default:
          return;
      }
      return instance.getDataSource().store().load().then((data) => {
        return {
          type: item.type,
          name: item.meta.name,
          data: data
        };
      });
    }).filter(Boolean);
    try {
      const downloadData = await Promise.all(dataPromises);
      console.log(downloadData);
      models.Report.downloadReportAllExceljs(downloadData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  return {
    download: [
      {
        label: localizedString.MSOffice,
        visible: true,
        contents: [
          {
            label: localizedString.excelXlsx,
            visible: true,
            onClick: () => {
              handleDownload();
            }
          },
          {
            label: localizedString.excelXls,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.word,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.powerpoint,
            visible: true,
            onClick: () => {
            }
          }
        ]
      },
      {
        label: localizedString.hancom,
        visible: true,
        contents: [
          {
            label: localizedString.hwp,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.cell,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
            }
          }
        ]
      },
      {
        label: localizedString.etc,
        visible: true,
        contents: [
          {
            label: localizedString.img,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.html,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
            }
          }
        ]
      }
    ],
    keys: [
      'download'
    ]
  };
};
export default DownloadDefaultElement;
