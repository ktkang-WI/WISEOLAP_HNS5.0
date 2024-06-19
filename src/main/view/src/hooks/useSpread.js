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

const fileCache = new Map();

const useSpread = () => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const {setBindingInfo} = SpreadSlice.actions;
  const loadingActions = LoadingSlice.actions;
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);
  const {importFile} = useFile();

  const getWorkbook = () => {
    const editMode = selectEditMode(store.getState());
    if (editMode === EditMode['DESIGNER']) {
      return designerRef.current.designer.getWorkbook();
    } else if (editMode === EditMode['VIEWER']) {
      return workbookRef.current.spread;
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
    const bindingInfos = selectBindingInfos(store.getState());
    const workbook = _workbook || getWorkbook();

    workbook.suspendPaint();
    workbook.suspendCalcService();
    workbook.suspendEvent();

    Object.keys(spreadData).forEach((datasetId) => {
      const bindingInfo = bindingInfos[datasetId];
      const rowData = spreadData[datasetId].rowData;
      const metaData = spreadData[datasetId].metaData;

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

      // 추후 환경설정 SpreadBinding 값으로 분기처리
      if (true) {
        // bindedSheet.reset();
        bindedSheet.clear();
        bindedSheet.autoGenerateColumns = true;
        const ds = getJsonKey2ColInfos(rowData);
        rowData.forEach((row) => convertDates(row));
        if (ds.dataSourceHearder) {
          const newRowData = [ds.dataSourceHearder, ...rowData];
          // bindedSheet.setArray(0, 0, newRowData);
          bindedSheet.setDataSource(newRowData);
          bindedSheet.bindColumns(ds.colInfos);
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
  };


  const sheetChangedListener = (designer) => {
    designer.getWorkbook().bind(sheets.Events.SheetChanged, changSheet);
  };

  const changSheet = (e, args) => {
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
      }, {includeBindingSource: true});
    });
    return blob;
  };

  const setExcelFile = async (reportId) => {
    if (fileCache.has(reportId)) {
      await excelIoOpen(reportId, fileCache.get(reportId))
          .then(() => dispatch(loadingActions.endJob()));
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
            .then(() => dispatch(loadingActions.endJob()));
      }
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

  return {
    getWorkbook,
    bindData,
    sheetChangedListener,
    sheetNameChangedListener,
    createReportBlob,
    setExcelFile
  };
};

export default useSpread;
