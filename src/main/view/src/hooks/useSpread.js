import {
  createColumnsAndRows,
  dataSourceMaker,
  deleteTables,
  generateColumns,
  createBorderStyle,
  getJsonKey2ColInfos
}
  from 'components/report/atomic/spreadBoard/util/spreadUtil';
import {useDispatch, useSelector} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos} from 'redux/selector/SpreadSelector';
import {sheets, insertWorkbookJSON, designerRef, workbookRef}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {defaultWorkbookJSON, excelIOOpenOtions}
  from 'components/report/atomic/spreadBoard/util/spreadContants';
import useFile from './useFile';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';
import store from 'redux/modules';
import useModal from './useModal';
import localizedString from 'config/localization';
import models from 'models';

const fileCache = new Map();

const useSpread = () => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const {setBindingInfo} = SpreadSlice.actions;
  const {startJob, endJob} = LoadingSlice.actions;
  const loadingActions = LoadingSlice.actions;
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);
  const editMode = useSelector(selectEditMode);
  const {importFile} = useFile();

  const getWorkbook = () => {
    if (editMode === EditMode['DESIGNER']) {
      return designerRef.current.designer.getWorkbook();
    } else if (editMode === EditMode['VIEWER']) {
      return workbookRef.current.designer.getWorkbook();
    }
  };

  // TODO: 정규표현식 공용 코드로 관리되도록 고려
  // 추가 적인 정규표현식을 사용하는 경우 여기서 참고하여 사용할 수 있음
  const isDateString = (value) => {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
      /^\d{4}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}$/, // YYYY.MM.DD HH:mm:ss
      /^\d{2}\.\d{2}\.\d{2}\s\d{2}:\d{2}:\d{2}$/ // DD.MM.YY HH:mm:ss
      // 추가적인 날짜 형식에 대한 정규 표현식들을 여기에 추가할 수 있음
    ];

    // 어떤 하나의 정규 표현식에도 매치되지 않으면 날짜 형식이 아님
    return datePatterns.some((pattern) => pattern.test(value));
  };

  const convertDates = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string' && isDateString(obj[key])) {
          const date = new Date(obj[key]);
          date.setHours(0, 0, 0, 0); // 시간 정보를 0으로 설정
          obj[key] = date;
        }
      }
    }
  };

  const bindData = (spreadData, _workbook) => {
    dispatch(startJob('시트에 데이터를 바인딩하는 중입니다.'));
    const bindingInfos = selectBindingInfos(store.getState());
    const workbook = _workbook || getWorkbook();
    let bindDataCheck = false;
    try {
      if (bindingInfos) {
        workbook.suspendPaint();
        workbook.suspendCalcService();
        workbook.suspendEvent();

        Object.keys(spreadData).forEach((datasetId) => {
          const bindingInfo = bindingInfos[datasetId];
          const rowData = _.cloneDeep(spreadData[datasetId].rowData);
          const metaData = spreadData[datasetId].metaData;
          const type = spreadData[datasetId].type;

          if (type?.type === 'showQuery') {
            return true;
          }

          if (rowData[0]?.error) {
            alert(localizedString.invalidQuery);
            return true;
          }

          const {columns} = generateColumns(metaData, sheets);
          let bindedSheet = workbook
              .getSheetFromName(bindingInfo.sheetNm);

          if (bindedSheet == undefined) {
            workbook.addSheet(0,
                new sheets.Worksheet(bindingInfo.sheetNm));
            bindedSheet = workbook
                .getSheetFromName(bindingInfo.sheetNm);
          }

          const {invoice, dataSource} = dataSourceMaker(rowData, sheets);
          createColumnsAndRows(columns, invoice, bindedSheet, bindingInfo);

          // TODO 추후 환경설정 SpreadBinding 값으로 분기처리
          if (true) {
            // bindedSheet.reset();
            bindedSheet.clear();
            bindedSheet.autoGenerateColumns = true;
            // 임시 추가 : bindingInfo
            const ds = getJsonKey2ColInfos(rowData, bindingInfo, bindedSheet);
            rowData.forEach((row) => convertDates(row));
            if (ds.dataSourceHearder && rowData.length > 0) {
              bindDataCheck = true;
              const newRowData = [ds.dataSourceHearder, ...rowData];
              // bindedSheet.setArray(0, 0, newRowData);

              // 임시 코드 TODO : 추후 환경설정 SpreadBinding 분기 개발 되면 삭제 예정
              if (bindingInfo.rowIndex > 0) {
                for (let i = 0; i < bindingInfo.rowIndex; i++) {
                  newRowData.unshift({});
                }
              }

              bindedSheet.setDataSource(newRowData, false);
              bindedSheet.bindColumns(ds.colInfos);
            } else {
              bindedSheet.clear(1, 0, bindedSheet.getRowCount(),
                  bindedSheet.getColumnCount(), 3, 1);
            }
          } else {
            deleteTables(bindedSheet);

            const table = bindedSheet.tables.add('table'+ bindingInfo.sheetNm,
                bindingInfo.rowIndex,
                bindingInfo.columnIndex,
                invoice.records.length+1,
                columns.length,
                createBorderStyle(bindingInfo.useBorder));

            table.showHeader(bindingInfo.useHeader);
            table.autoGenerateColumns(false);
            table.bindColumns(columns);
            table.bindingPath('records');
            table.bandRows(false);
            table.bandColumns(false);
            bindedSheet.options.gridline.showHorizontalGridline = true;
            bindedSheet.options.gridline.showVerticalGridline = true;
            bindedSheet.invalidateLayout();

            bindedSheet.setDataSource(dataSource);
            table.filterButtonVisible(false);
          }
        });

        workbook.resumeEvent();
        workbook.resumeCalcService();
        workbook.resumePaint();
        if (bindDataCheck) {
          refreshPivotTable(workbook);
        }
      }
    } catch (e) {
      console.error(e);
      workbook.resumeEvent();
      workbook.resumeCalcService();
      workbook.resumePaint();
    }

    dispatch(endJob('시트에 데이터를 바인딩하는 중입니다.'));
  };

  const refreshPivotTable = (workbook) => {
    const sheetLength = workbook.getSheetCount();
    for (let i = 0; i < sheetLength; i++) {
      const sheet = workbook.getSheet(i);
      const pivotTableManager = sheet.pivotTables;
      const pivotTables = pivotTableManager.all();
      for (const pivotTable of pivotTables) {
        pivotTable.updateSource();
      }
    }
  };

  const initSpreadBar = (workbook, reportId) => {
    // init Status Bar
    // eslint-disable-next-line max-len
    const statusBar = new sheets.StatusBar.StatusBar(document.getElementById('statusBar' + reportId));
    statusBar.bind(workbook);
  };

  // 수식 계산 시 progressBar 보이도록 수정
  const calculationProgressListener = (workbook) => {
    workbook.bind(
        sheets.Events.CalculationProgress,
        (e, info) => {
          const {totalCells, pendingCells} = info;
          if (totalCells === pendingCells) {
            dispatch(startJob('엑셀 수식을 계산 중입니다.'));
          }
          if (pendingCells === 0) {
            dispatch(endJob('엑셀 수식을 계산 중입니다.'));
          }
        }
    );
  };

  const sheetChangedListener = (workbook) => {
    workbook.bind(
        sheets.Events.SheetChanged,
        (e, args) => changSheet(e, args, workbook)
    );
  };

  const changSheet = (e, args, workbook) => {
    if (args.propertyName === 'deleteSheet') {
      deletedSheet(e, args);
    }
  };

  const deletedSheet = (e, args) => {
    const datasetNms = Object.keys(bindingInfos);
    if (!_.isEmpty(bindingInfos)) return null;
    datasetNms.map((datasetId) => {
      if (bindingInfos[datasetId].sheetNm === args.sheetName) {
        const newBindingInfo = _.cloneDeep(bindingInfos[datasetId]);
        newBindingInfo.sheetNm = undefined;
        newBindingInfo.useBind = false;
        dispatch(setBindingInfo({
          reportId: reportId,
          datasetId: datasetId,
          bindingInfo: newBindingInfo
        }));
      }
    });
  };

  const sheetNameChangedListener = (designer) => {
    designer.getWorkbook().bind(sheets.Events.SheetNameChanged,
        renameSheet);
  };

  const renameSheet = (e, args) => {
    Object.keys(bindingInfos).forEach((datasetId) => {
      if (bindingInfos[datasetId].sheetNm === args.oldValue) {
        const newBindingInfo = _.cloneDeep(bindingInfos[datasetId]);
        newBindingInfo.sheetNm = args.newValue;
        dispatch(setBindingInfo({
          reportId: reportId,
          datasetId: datasetId,
          bindingInfo: newBindingInfo
        }));
      }
    });
  };

  const createReportBlob = async () => {
    const workbook = getWorkbook();
    const blob = await new Promise((resolve, reject) => {
      workbook.save((b) => {
        resolve(b);
      }, (e) => {
      }, {includeBindingSource: false});
    });
    return blob;
  };

  const setExcelFile = async (reportId) => {
    dispatch(startJob('엑셀 파일을 불러오는 중입니다.'));
    try {
      if (fileCache.has(reportId) && editMode === EditMode['VIEWER']) {
        await excelIoOpen(reportId, fileCache.get(reportId))
            .then(() => dispatch(loadingActions.endJob())).catch((e) => {
              console.log(e);
            });
      } else {
        const response = await importFile({fileName: reportId + '.sjs'});
        let data;
        if (response.status !== 200) {
          data = defaultWorkbookJSON;
          insertWorkbookJSON({
            reportId: reportId,
            workbookJSON: defaultWorkbookJSON
          });
        } else {
          data = response.data;
          const blob = new Blob(
              [data]
          );
          fileCache.set(reportId, blob);
          await excelIoOpen(reportId, blob)
              .then(() => dispatch(loadingActions.endJob())).catch((e) => {
                console.log(e);
              });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(endJob('엑셀 파일을 불러오는 중입니다.'));
    }
  };

  const excelIoOpen = (reportId, file) => {
    return new Promise((resolve) => {
      const workbook = getWorkbook();
      dispatch(loadingActions.startJob());
      workbook.open(file, () => {
        resolve();
      }, () => {}, excelIOOpenOtions);
    });
  };

  const hnsDrmUpload = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      dispatch(loadingActions.startJob());

      // 파일 업로드
      const uploadResponse = await models.File.hnsDrmUpload(formData);

      if (uploadResponse.status === 200) {
        // 복호화 API 호출
        const responseData = await fetchData(uploadResponse.data);

        // 복호화 된 파일 불러오기
        await importHnsFile(responseData.fileName, responseData.filePath);
        dispatch(loadingActions.endJob());
      }
    } catch (error) {
      console.error('Error during hnsDrmUpload:', error);
      dispatch(loadingActions.endJob());
      alert('파일을 불러오는데 실패했습니다. \n 관리자에게 문의하세요.');
    }
  };

  const importHnsFile = async (fileName, filePath) => {
    try {
      const workbook = getWorkbook();

      const response = await models.File.loadDecryptionFile({
        fileName: `${fileName}`,
        filePath: `${filePath}`
      });

      if (response.status === 200) {
        const blob = new Blob([response.data],
            // eslint-disable-next-line max-len
            {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});

        return new Promise((resolve, reject) => {
          workbook.import(
              blob,
              () => {
                resolve();
              },
              (error) => {
                reject(error);
              },
              excelIOOpenOtions
          );
        });
      } else {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error importing file:', error);
      throw error;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const fetchData = async (fileName) => {
    try {
      const response = await models.File.callDrmApi({
        fileName: `${fileName}`
      });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const responseData = response.data.responseData;

      return responseData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  /*
  const clearBindingSheet = () => {
    return new Promise((resolve) => {
      const workbook = getWorkbook();
      const bindingInfos = selectBindingInfos(store.getState());

      if (bindingInfos) {
        workbook.suspendPaint();
        workbook.suspendCalcService();
        workbook.suspendEvent();
        Object.keys(bindingInfos).forEach((datasetId) => {
          const bindingInfo = bindingInfos[datasetId];
          console.log('시트이름: '+bindingInfo.sheetNm);
          let bindedSheet = workbook
              .getSheetFromName(bindingInfo.sheetNm);

          if (bindedSheet == undefined) {
            workbook.addSheet(0,
                new sheets.Worksheet(bindingInfo.sheetNm));
            bindedSheet = workbook
                .getSheetFromName(bindingInfo.sheetNm);
          }
          bindedSheet.setDataSource([]);
          // bindedSheet.clear();
        });
        workbook.resumeEvent();
        workbook.resumeCalcService();
        workbook.resumePaint();
      }
    });
  };
  */

  return {
    getWorkbook,
    bindData,
    calculationProgressListener,
    sheetChangedListener,
    initSpreadBar,
    sheetNameChangedListener,
    createReportBlob,
    setExcelFile,
    hnsDrmUpload
  };
};

export default useSpread;
