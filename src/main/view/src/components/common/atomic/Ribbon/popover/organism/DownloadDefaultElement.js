import localizedString from 'config/localization';
import store from 'redux/modules';
import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
// import models from 'models';
import PivotGrid from 'devextreme/ui/pivot_grid';
import DataGrid from 'devextreme/ui/data_grid';
import Chart from 'devextreme/viz/chart';
import PieChart from 'devextreme/viz/pie_chart';
import {Workbook} from 'exceljs';
import saveAs from 'file-saver';
import {exportPivotGrid, exportDataGrid} from 'devextreme/excel_exporter';

const DownloadDefaultElement = () => {
  const items = selectCurrentItems(store.getState());
  const parameters = selectRootParameter(store.getState());
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);
  const downloadAllSet = {items, parameters, dataSource};
  console.log('downloadAllSet', downloadAllSet);

  const addImageToWorksheet = async (workbook, worksheet, blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        const imageId = workbook.addImage({
          buffer: arrayBuffer,
          extension: 'png'
        });
        worksheet.addImage(imageId, {
          tl: {col: 0.0, row: 0.0},
          br: {col: 12.9999, row: 30.9999}
        });
        resolve();
      };
      reader.onerror = function(event) {
        reject(event.target.error);
      };
      reader.readAsArrayBuffer(blob);
    });
  };
  const handleDownload = async () => {
    const workbook = new Workbook();
    let worksheetCount = 0;
    const elements = items.map((item) => {
      const element = document.getElementById(item.id);
      return {
        type: item.type,
        name: item.meta.name,
        element: element
      };
    });
    for (const elementObj of elements) {
      if (elementObj.type === 'pivot') {
        const instance = PivotGrid.getInstance(elementObj.element);
        const worksheet =
        workbook.addWorksheet(elementObj.name);
        await exportPivotGrid({
          component: instance,
          worksheet: worksheet
        });
        worksheetCount++;
      } else if (elementObj.type === 'grid') {
        const instance = DataGrid.getInstance(elementObj.element);
        const worksheet =
        workbook.addWorksheet(elementObj.name);
        await exportDataGrid({
          component: instance,
          worksheet: worksheet
        });
        worksheetCount++;
      } else if (elementObj.type === 'chart') {
        const instance = Chart.getInstance(elementObj.element);
        const blob = await new Promise((resolve, reject) => {
          instance.on('fileSaving', function(e) {
            e.cancel = true; // Prevent default file saving
            resolve(e.data); // Get the data URI of the chart image
          });
          instance.exportTo('PNG').catch(reject);
        });
        const worksheet = workbook.addWorksheet(elementObj.name);
        await addImageToWorksheet(workbook, worksheet, blob);
        worksheetCount++;
      } else if (elementObj.type === 'pie') {
        const instance = PieChart.getInstance(elementObj.element);
        const blob = await new Promise((resolve, reject) => {
          instance.on('fileSaving', function(e) {
            e.cancel = true; // Prevent default file saving
            resolve(e.data); // Get the data URI of the chart image
          });
          instance.exportTo('PNG').catch(reject);
        });
        const worksheet = workbook.addWorksheet(elementObj.name);
        await addImageToWorksheet(workbook, worksheet, blob);
        worksheetCount++;
      }
    }
    if (worksheetCount > 0) {
      const blobType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {type: blobType});
      saveAs(blob, 'PivotGrids');
    }
  };

  // function replacer(key, value) {
  //   const seen = new WeakSet();
  //   return (key, value) => {
  //     if (typeof value === 'object' && value !== null) {
  //       if (seen.has(value)) {
  //         return;
  //       }
  //       seen.add(value);
  //     }
  //     return value;
  //   };
  // }

  // const safeStringify = (obj) => JSON.stringify(obj, replacer());
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
              // models.Report.downloadReportAll(
              //     safeStringify(downloadAllSet), '.xlsx');
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
