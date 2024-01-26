import PivotGrid from 'devextreme/ui/pivot_grid';
import DataGrid from 'devextreme/ui/data_grid';
import Chart from 'devextreme/viz/chart';
import PieChart from 'devextreme/viz/pie_chart';
import {Workbook} from 'exceljs';
import saveAs from 'file-saver';
import {exportPivotGrid, exportDataGrid} from 'devextreme/excel_exporter';

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
        br: {col: 13.9999, row: 30.9999}
      });
      resolve();
    };
    reader.onerror = function(event) {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(blob);
  });
};

export const handleDownload = async (items, parameters, dataSource) => {
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
          e.cancel = true;
          resolve(e.data);
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
          e.cancel = true;
          resolve(e.data);
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
