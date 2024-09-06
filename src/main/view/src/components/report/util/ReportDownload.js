/* eslint-disable max-len */
import PivotGrid from 'devextreme/ui/pivot_grid';
import DataGrid from 'devextreme/ui/data_grid';
import Chart from 'devextreme/viz/chart';
import PieChart from 'devextreme/viz/pie_chart';
import {Workbook} from 'exceljs';
import {exportPivotGrid, exportDataGrid} from 'devextreme/excel_exporter';
import models from 'models';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  ImageRun
} from 'docx';
import PptxGenJS from 'pptxgenjs';
import {selectFlexLayoutConfig, selectRootLayout} from 'redux/selector/LayoutSelector';
import store from 'redux/modules';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {selectCurrentAdHocOption} from 'redux/selector/ItemSelector';
import {getExcelCellFormat, getFormats} from '../item/pivot/FormatUtility';
import {formatNumber, generateLabelSuffix} from 'components/utils/NumberFormatUtility';
import {isDataCell as highlightIsDataCell, getCssStyle, addStyleVariationValue} from '../item/pivot/DataHighlightUtility';


const EXCEL_ROW_HEIGHT = 23.055;
const EXCEL_COLUMN_WIDTH = 71.811;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const {endJob, startJob} = LoadingSlice.actions;

const arrayBufferToBase64 = (arrayBuffer) => {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  bytes.forEach((byte) => binary += String.fromCharCode(byte));
  return btoa(binary);
};

const addImageToWorksheet = async (workbook, worksheet, blob, startRow) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const arrayBuffer = event.target.result;
      const imageId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'png'
      });

      const img = new Image();
      img.onload = function() {
        const imgWidth = img.width;
        const imgHeight = img.height;

        const maxColSpan = 18; // 이미지가 차지할 최대 열의 수
        const maxRowSpan = 28; // 이미지가 차지할 최대 행의 수

        const maxWidth = EXCEL_COLUMN_WIDTH * maxColSpan;
        const maxHeight = EXCEL_ROW_HEIGHT * maxRowSpan;

        const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight, 1);

        const displayWidth = imgWidth * scale;
        const displayHeight = imgHeight * scale;

        const endCol = displayWidth / EXCEL_COLUMN_WIDTH;
        const endRow = displayHeight / EXCEL_ROW_HEIGHT;

        worksheet.addImage(imageId, {
          tl: {col: 0.0, row: startRow},
          br: {col: endCol, row: startRow + endRow}
        });

        resolve();
      };

      img.onerror = function(event) {
        reject(event);
      };

      // Blob URL을 생성하고 이미지를 로드
      const blobURL = URL.createObjectURL(blob);
      img.src = blobURL;
    };
    reader.onerror = function(event) {
      reject(event.target.error);
    };
    reader.readAsArrayBuffer(blob);
  });
};

const convertToBlob = async (element) => {
  try {
    const canvas = await html2canvas(element);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Blob 생성 실패'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error converting to blob:', error);
    throw error;
  }
};

const exportComponentToWorksheet = async (
    workbook, elementObj, worksheet, startRow, option, dataField, adhocOption, highlight) => {
  switch (elementObj.type) {
    case 'pivot':
    case 'grid': {
      console.log('dataField', dataField);
      const instance = elementObj.type === 'pivot'?
        PivotGrid.getInstance(elementObj.selector):
        DataGrid.getInstance(elementObj.selector);
      const isPivotGrid = elementObj.type === 'pivot';
      await (isPivotGrid ? exportPivotGrid : exportDataGrid)({
        component: instance,
        worksheet: worksheet,
        topLeftCell: {row: startRow + 1, column: 1},
        ...(isPivotGrid ? {mergeColumnFieldValues: option?.mergeColumn} : {}),
        ...(isPivotGrid ? {mergeRowFieldValues: option?.mergeRow} : {}),
        // 240903 홈앤쇼핑 행 차원항목 표시(열은 제대로 표시안됨)
        ...(isPivotGrid ? {exportRowFieldHeaders: true} : {}),
        customizeCell: ({pivotCell, excelCell}) => {
          if (pivotCell.area == 'data' && pivotCell.dataType && pivotCell.value) {
            const formats = getFormats(dataField, adhocOption);
            const formData = formats[pivotCell.dataIndex];
            const {newFormData, colorStyle} = addStyleVariationValue(formData, pivotCell);

            if (newFormData) {
              const labelSuffix = generateLabelSuffix(newFormData);
              const formattedValue = formatNumber(pivotCell.value, newFormData, labelSuffix);
              let backgroundColor = '';
              let color = colorStyle.color.slice(1);

              if (highlight.length != 0) {
                for (let i=0; i<highlight.length; i++) {
                  if (highlightIsDataCell(pivotCell, pivotCell.area, highlight[i])) {
                    const cssStyle = getCssStyle(highlight[i], null, pivotCell);
                    if (cssStyle) {
                      cssStyle['background-color'] = cssStyle['background-color'].slice(1);
                      cssStyle['color'] = cssStyle['color'].slice(1);
                      ({'background-color': backgroundColor, 'color': color} = cssStyle);
                      break;
                    }
                  }
                }
              }

              Object.assign(excelCell, getExcelCellFormat({backgroundColor, color, formattedValue}));
            }
          }
        }
      });
      break;
    }
    case 'chart':
    case 'pie': {
      const instance = elementObj.type === 'chart'?
        Chart.getInstance(elementObj.selector):
        PieChart.getInstance(elementObj.selector);

      const blob = await new Promise((resolve, reject) => {
        instance.on('fileSaving', function(e) {
          e.cancel = true;
          resolve(e.data);
        });
        instance.exportTo('PNG').catch(reject);
      });
      await addImageToWorksheet(workbook, worksheet, blob, startRow);
      break;
    }
    default:
      if (elementObj.selector) {
        const blob = await convertToBlob(document.querySelector(elementObj.selector));
        await addImageToWorksheet(workbook, worksheet, blob, startRow);
      }
  }
};

const getExcelBlob = async (defaultFileName, downloadData) => {
  const res = await models.Download.getExcelBlob(downloadData);

  if (res.status != 200) {
    console.error('Download Error: ', res.data);
    return;
  }

  const contentDisposition = res.headers['content-disposition'];
  let newFileName = defaultFileName;
  if (contentDisposition) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      newFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
    }
  }

  return {
    name: newFileName,
    blob: new Blob([res.data])
  };
};

const mergeExcelFiles = async (items, parameters, parameterValues, option) => {
  const reportId = selectCurrentReportId(store.getState());
  const layout = selectFlexLayoutConfig(store.getState());
  const adhocOption = selectCurrentAdHocOption(store.getState());
  const workbook = new Workbook();
  let worksheetCount = 0;

  const _items = _.cloneDeep(items).sort((a, b) => {
    return (a.tab || 0) - (b.tab || 0);
  });

  const elements = _items.map((item, index) => {
    const selector = '#report' + reportId + ' #' + item.id;

    return {
      type: item.type,
      name: item.meta.name,
      selector: selector,
      tab: item.tab || 0,
      index
    };
  });

  let tab = -1;

  const tabElements = [];

  if (Array.isArray(layout)) {
    layout.forEach((config, i) => {
      tabElements.push(document.querySelector('.board-' + reportId + '-' + i));
    });
  } else {
    tabElements.push(document.querySelector('.board-' + reportId + '-' + 0));
  }

  const prevDisplay = tabElements.map((element) => {
    const prev = element.style.display;
    element.style.display = 'none';
    return prev;
  });

  for (const elementObj of elements) {
    if (tab != elementObj.tab) {
      tab = elementObj.tab;
      tabElements[tab].style.display = 'flex';

      if (tab > 0) {
        tabElements[tab - 1].style.display = 'none';
      }
      await delay(200);
    }

    let startRow = 2;
    const worksheet = workbook.addWorksheet(elementObj.name);
    if (parameters) {
      worksheet.getCell('A1').value = '필터차원';
      worksheet.getCell('B1').value = '조건값';
      parameters.forEach((info) => {
        // 240903 parameter.information의 defaultvalue대신 parameter의 value를 이용
        // info.name의 매개변수명으로 value 추출
        const paramValue = parameterValues[info.name]?.value || [];
        if (paramValue.length) {
          if (info.operation === 'BETWEEN' && info.paramType === 'CALENDAR') {
            // 240903 비트윈 캘린더용 날짜필터 추가
            const fromRow = worksheet.getRow(startRow);
            fromRow.getCell(1).value = info.caption + '_FROM';
            fromRow.getCell(2).value = paramValue[0] || '전체';
            const toRow = worksheet.getRow(startRow+1);
            toRow.getCell(1).value = info.caption + '_TO';
            toRow.getCell(2).value = paramValue[1] || '전체';
            startRow+=2;
          } else {
            const row = worksheet.getRow(startRow);
            row.getCell(1).value = info.caption;
            paramValue.forEach((val, i) => {
              if (val === '' || val === '[All]') {
                val = '전체';
              }
              row.getCell(i + 2).value = val;
            });
            startRow+=1;
          }
        }
      });
    }

    const dataField = adhocOption?.dataField || _items[elementObj.index]?.meta?.dataField;
    const dataFieldOption = adhocOption?.dataFieldOption || _items[elementObj.index]?.mart?.dataFieldOption;
    const highlight = _items[elementObj.index]?.meta.dataHighlight;

    const insertFieldData = (key) => {
      if (dataField[key] == 0) return;

      worksheet.getCell('A' + (startRow + 1)).value = dataFieldOption[key].label;
      worksheet.getCell('B' + (startRow + 1)).value = dataField[key].map(({caption}) => caption).join(', ');

      startRow++;
    };

    if (dataField.measure) {
      insertFieldData('measure');
    }

    for (const key in dataFieldOption) {
      if (dataField[key].length == 0 || ['sortByItem', 'measure'].includes(key)) {
        continue;
      }

      insertFieldData(key);
    }

    await exportComponentToWorksheet(
        workbook, elementObj, worksheet, startRow, option, dataField, adhocOption, highlight);
    worksheetCount++;
  }

  tabElements.forEach((element, i) => {
    element.style.display = prevDisplay[i];
  });

  return worksheetCount == 0 ? false : workbook;
};

export const exportExcel = async (
    report,
    items,
    parameters,
    parameterValues,
    dataSource,
    option) => {
  store.dispatch(startJob());
  try {
    const workbook = await mergeExcelFiles(items, parameters, parameterValues, option);

    if (workbook) {
      const blobType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {type: blobType});
      const downloadData = new FormData();
      downloadData.append('file', blob);
      downloadData.append('fileName', dataSource.reportNm + '.xlsx');
      downloadData.append('reportType', report?.options.reportType);
      downloadData.append('reportNm', report?.options?.reportNm || 'New Report');
      downloadData.append('reportId', report?.reportId || '1001');

      const file = await getExcelBlob('report.xlsx', downloadData);
      const url = window.URL.createObjectURL(file.blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (e) {
    console.error(e);
  } finally {
    store.dispatch(endJob());
  }
};

export const exportImg = async (report, fileName) => {
  store.dispatch(startJob());
  const selectedElements =
    document.querySelectorAll('.tab-selected, .flexlayout__tabset');
  selectedElements.forEach((element) =>
    element.classList.add('download'));
  const elements = [];
  const layout = selectRootLayout(store.getState());
  let useContainer = false;

  if (Array.isArray(layout.layoutConfig)) {
    useContainer = true;
    layout.layoutConfig.forEach((config, i) => {
      elements.push(document.querySelector('.board-' + report.reportId + '-' + i));
    });
  } else {
    elements.push(document.querySelector('.board-' + report.reportId + '-' + 0));
  }

  const prevDisplay = elements.map((element) => {
    const prev = element.style.display;
    element.style.display = 'none';
    return prev;
  });

  try {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element) {
        element.style.display = 'block';
        // 아이템 렌더링에 필요한 지연
        await delay(200);
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true
        });
        const image = canvas.toDataURL('image/png');
        element.style.display = 'none';
        const link = document.createElement('a');
        link.href = image;
        link.download = fileName + (useContainer ? '-' + layout.layoutConfig[i].title : '') + '.png';
        link.click();

        models.Log.insertDownloadLog(
            report?.reportId || '1001',
            report?.options?.reportNm || 'New Report',
            report?.options?.reportType || '',
            '',
            ''
        );
      }
    }
  } catch (error) {
    console.error('Error exporting image:', error);
  } finally {
    elements.forEach((element, i) => {
      element.style.display = prevDisplay[i];
    });
    selectedElements.forEach((element) =>
      element.classList.remove('download'));
    store.dispatch(endJob());
  }
};

export const exportPdf = async (report, fileName, items, parameters, option) => {
  store.dispatch(startJob());
  try {
    const workbook = await mergeExcelFiles(items, parameters, option);
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF();
    let pageAdded = false;

    for (const sheet of workbook.worksheets) {
      const table = document.createElement('table');
      table.style.borderCollapse = 'collapse';

      const maxRow = sheet.getImages().length > 0 ? 2 : sheet.rowCount;
      const maxCol = sheet.columnCount;

      // excel sheet html table로 변환
      for (let rowNumber = 1; rowNumber <= maxRow; rowNumber++) {
        const tr = document.createElement('tr');
        for (let colNumber = 1; colNumber <= maxCol; colNumber++) {
          const cell = sheet.getCell(rowNumber, colNumber);
          const td = document.createElement('td');
          td.textContent = cell.text ? cell.text : '';
          td.style.border = '1px solid black';
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.top = '100%';
      tempContainer.style.padding = '20px';
      const title = document.createElement('h2');
      title.textContent = sheet.name;
      title.width = 'auto';
      tempContainer.appendChild(title);
      tempContainer.appendChild(table);
      document.body.appendChild(tempContainer);

      // 이미지 추가
      const loadImages = sheet.getImages().map((image) => {
        return new Promise((resolve) => {
          const imageId = image.imageId;
          const imageData = workbook.getImage(imageId).buffer;
          const imgElement = document.createElement('img');
          const blob = new Blob([imageData], {type: 'image/png'});
          imgElement.src = URL.createObjectURL(blob);

          imgElement.style.width =
            `${(image.range.br.col - image.range.tl.col) * EXCEL_COLUMN_WIDTH}px`;
          imgElement.style.height =
            `${(image.range.br.row - image.range.tl.row) * EXCEL_ROW_HEIGHT}px`;
          imgElement.onload = () => resolve(imgElement);
          tempContainer.appendChild(imgElement);
        });
      });

      await Promise.all(loadImages);

      // HTML을 이미지로 변환
      const canvas = await html2canvas(tempContainer, {scale: 1});
      const imgData = canvas.toDataURL('image/png');

      if (pageAdded) {
        pdf.addPage();
      }
      pageAdded = true;

      // 이미지의 크기 가져오기 (픽셀 단위)
      const imgWidthPx = canvas.width;
      const imgHeightPx = canvas.height;

      // PDF 페이지의 사이즈 가져오기 (밀리미터 단위)
      const pdfWidthMm = pdf.internal.pageSize.getWidth();
      const pdfHeightMm = pdf.internal.pageSize.getHeight();

      // 밀리미터를 픽셀로 변환
      const pdfWidthPx = Math.floor(pdfWidthMm * 96 / 25.4);
      const pdfHeightPx = Math.floor(pdfHeightMm * 96 / 25.4);

      let adjustedWidthPx = imgWidthPx;
      let adjustedHeightPx = imgHeightPx;

      // 이미지가 PDF 페이지보다 클 경우 크기 조정
      if (imgWidthPx > pdfWidthPx || imgHeightPx > pdfHeightPx) {
        const ratioWidth = pdfWidthPx / imgWidthPx;
        const ratioHeight = pdfHeightPx / imgHeightPx;
        const ratio = Math.min(ratioWidth, ratioHeight);

        adjustedWidthPx = Math.floor(imgWidthPx * ratio);
        adjustedHeightPx = Math.floor(imgHeightPx * ratio);
      }

      // 조정된 크기를 밀리미터 단위로 변환
      const adjustedWidthMm = adjustedWidthPx * 25.4 / 96;
      const adjustedHeightMm = adjustedHeightPx * 25.4 / 96;

      // 이미지를 PDF에 추가
      pdf.addImage(imgData, 'PNG', 0, 0, adjustedWidthMm, adjustedHeightMm);

      models.Log.insertDownloadLog(
          report?.reportId || '1001',
          report?.options?.reportNm || 'New Report',
          report?.options?.reportType || '',
          '',
          ''
      );

      document.body.removeChild(tempContainer);
    }

    // PDF 저장
    pdf.save(fileName + '.pdf');
  } catch (e) {
    console.error(e);
  } finally {
    store.dispatch(endJob());
  }
};

export const exportDocx = async (report, fileName, items, parameters, option) => {
  store.dispatch(startJob());
  try {
    const workbook = await mergeExcelFiles(items, parameters, option);
    const sections = [];

    for (const sheet of workbook.worksheets) {
      const tableRows = [];

      const maxRow = sheet.getImages().length > 0 ? 2 : sheet.rowCount;
      const maxCol = sheet.columnCount;

      for (let rowNumber = 1; rowNumber <= maxRow; rowNumber++) {
        const tableCells = [];
        for (let colNumber = 1; colNumber <= maxCol; colNumber++) {
          const cell = sheet.getCell(rowNumber, colNumber);
          tableCells.push(new TableCell({
            children: [new Paragraph(cell.text ? cell.text : '')],
            borders: {
              top: {style: 'single', size: 1, color: '000000'},
              bottom: {style: 'single', size: 1, color: '000000'},
              left: {style: 'single', size: 1, color: '000000'},
              right: {style: 'single', size: 1, color: '000000'}
            }
          }));
        }
        tableRows.push(new TableRow({children: tableCells}));
      }

      const table = new Table({
        rows: tableRows,
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      });

      const children = [
        new Paragraph({text: sheet.name, heading: 'Heading1'}),
        table
      ];

      // 이미지 추가
      sheet.getImages().forEach((image) => {
        const imageId = image.imageId;
        const imageData = workbook.getImage(imageId).buffer;
        const blob = new Blob([imageData], {type: 'image/png'});
        const startCell = image.range.tl;
        const endCell = image.range.br;

        const widthInPixels = (endCell.col - startCell.col) * EXCEL_COLUMN_WIDTH;
        const heightInPixels = (endCell.row - startCell.row) * EXCEL_ROW_HEIGHT;

        const mediaImage = new ImageRun({
          data: blob,
          transformation: {
            width: widthInPixels,
            height: heightInPixels
          }
        });

        children.push(
            new Paragraph({
              children: [mediaImage]
            })
        );
      });

      sections.push({
        children
      });
    }

    const doc = new Document({
      creator: 'WISEITECH',
      sections
    });

    Packer.toBlob(doc).then((blob) => {
      models.Log.insertDownloadLog(
          report?.reportId || '1001',
          report?.options?.reportNm || 'New Report',
          report?.options?.reportType || '',
          '',
          ''
      );
      saveAs(blob, fileName + '.docx');
    });
  } catch (e) {
    console.error(e);
  } finally {
    store.dispatch(endJob());
  }
};

export const exportPptx = async (report, fileName, items, parameters, option) => {
  store.dispatch(startJob());

  try {
    const workbook = await mergeExcelFiles(items, parameters, option);
    const pptx = new PptxGenJS();

    for (const sheet of workbook.worksheets) {
      const slide = pptx.addSlide();

      const maxRow = sheet.getImages().length > 0 ? 2 : sheet.rowCount;
      const maxCol = sheet.columnCount;

      slide.addText(sheet.name, {
        x: 1,
        y: 0.3,
        w: 3,
        h: 0.5
      });

      // 표 생성
      const table = [];
      for (let rowNumber = 1; rowNumber <= maxRow; rowNumber++) {
        const row = [];
        for (let colNumber = 1; colNumber <= maxCol; colNumber++) {
          const cell = sheet.getCell(rowNumber, colNumber);
          row.push(cell.text ? cell.text : '');
        }
        table.push(row);
      }

      // 표 스타일 설정
      const tableOpts = {
        x: 1, y: 1, w: 8,
        autoPage: true,
        fontSize: 10,
        fill: {color: 'F7F7F7'},
        border: {pt: 1, color: '000000'}
      };

      // 표 추가
      if (table.length > 0) {
        slide.addTable(table, tableOpts);
      }

      // 이미지 추가
      sheet.getImages().forEach((image) => {
        const imageId = image.imageId;
        const imageData = workbook.getImage(imageId).buffer;
        const startCell = image.range.tl;
        const endCell = image.range.br;

        const base64Str = 'image/png;base64,' + arrayBufferToBase64(imageData);

        const widthInPixels = (endCell.col - startCell.col) * EXCEL_COLUMN_WIDTH / 96;
        const heightInPixels = (endCell.row - startCell.row) * EXCEL_ROW_HEIGHT / 96;

        slide.addImage({
          data: base64Str,
          x: 1 + startCell.col * table.length * 12 / 96,
          y: 1 + startCell.row * table.length * 12 / 96,
          w: widthInPixels,
          h: heightInPixels
        });
      });
    }

    pptx.writeFile(fileName + '.pptx', (error) => {
      if (error) {
        console.error('Error saving PowerPoint file:', error);
      } else {
        models.Log.insertDownloadLog(
            report?.reportId || '1001',
            report?.options?.reportNm || 'New Report',
            report?.options?.reportType || '',
            '',
            ''
        );
        console.log('PowerPoint file saved successfully.');
      }
    });
  } catch (e) {
    console.error(e);
  } finally {
    store.dispatch(endJob());
  }
};
