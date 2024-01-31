import PivotGrid from 'devextreme/ui/pivot_grid';
import DataGrid from 'devextreme/ui/data_grid';
import Chart from 'devextreme/viz/chart';
import PieChart from 'devextreme/viz/pie_chart';
import {Workbook} from 'exceljs';
import {exportPivotGrid, exportDataGrid} from 'devextreme/excel_exporter';
import {downloadReportExcelAll} from 'models/report/Download';

const addImageToWorksheet = async (workbook, worksheet, blob, startRow) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const arrayBuffer = event.target.result;
      const imageId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'png'
      });
      worksheet.addImage(imageId, {
        tl: {col: 0.0, row: startRow},
        br: {col: 13.9999, row: 27.9999}
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
  console.log('parameters', parameters);
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
    let startRow = 2;
    const worksheet = workbook.addWorksheet(elementObj.name);
    if (parameters.informations) {
      worksheet.getCell('A1').value = '필터차원';
      worksheet.getCell('B1').value = '조건값';
      parameters.informations.forEach((info, index) => {
        const defaultValue =
        (info.defaultValue && info.defaultValue.length) ?
        info.defaultValue.join('') : '';
        worksheet.getRow(index + 2).values = [info.caption, defaultValue];
      });
      startRow += parameters.informations.length;
    }
    if (elementObj.type === 'pivot') {
      const instance = PivotGrid.getInstance(elementObj.element);
      await exportPivotGrid({
        component: instance,
        worksheet: worksheet,
        topLeftCell: {row: startRow +1, column: 1}
      });
      worksheetCount++;
    } else if (elementObj.type === 'grid') {
      const instance = DataGrid.getInstance(elementObj.element);
      await exportDataGrid({
        component: instance,
        worksheet: worksheet,
        topLeftCell: {row: startRow +1, column: 1}
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
      await addImageToWorksheet(workbook, worksheet, blob, startRow);
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
      await addImageToWorksheet(workbook, worksheet, blob, startRow);
      worksheetCount++;
    }
  }
  if (worksheetCount > 0) {
    const blobType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {type: blobType});
    const downloadData = new FormData();
    downloadData.append('file', blob);
    downloadData.append('fileName', dataSource.reportNm + '.xlsx');
    downloadReportExcelAll(downloadData);
  }
};
