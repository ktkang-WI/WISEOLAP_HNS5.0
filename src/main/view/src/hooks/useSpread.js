import {createColumnsAndRows, deleteTables, generateColumns}
  from 'components/report/atomic/spreadBoard/util/spreadUtil';
import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos,
  selectCurrentDesigner,
  selectExcelConfig,
  selectExcelIO,
  selectSheets} from 'redux/selector/SpreadSelector';

const useSpread = () => {
  const sheets = selectSheets(store.getState());
  const dispatch = useDispatch();
  const {setBindingInfo, setDesigner} = SpreadSlice.actions;
  const designer = useSelector(selectCurrentDesigner);
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);
  const excelIO = useSelector(selectExcelIO);


  const bindData = ({dataset, datas}) => {
    const bindingInfo = bindingInfos[dataset.datasetId];
    // foreach로 bindingInfos에서 datasetId로 찾아서 진행
    // 추후 메게변수로 가져와야함.
    const {columns} = generateColumns(datas);
    let bindedSheet = designer.getWorkbook()
        .getSheetFromName(bindingInfo.sheetNm);

    if (bindedSheet == undefined) {
      designer.getWorkbook().addSheet(0,
          new sheets.Worksheet(bindingInfo.sheetNm));
      bindedSheet = designer.getWorkbook()
          .getSheetFromName(bindingInfo.sheetNm);
    }

    const {invoice, dataSource} = dataSourceMaker(datas);
    createColumnsAndRows(columns, invoice, bindedSheet, bindingInfo);
    deleteTables(bindedSheet);

    designer.getWorkbook().suspendPaint();

    const table = bindedSheet.tables.add('table'+ bindingInfo.sheetNm,
        bindingInfo.rowIndex,
        bindingInfo.columnIndex,
        invoice.records.length+1,
        columns.length,
        createBorderStyle(bindingInfo.useBorder));

    table.showHeader(true);
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

    designer.getWorkbook().resumePaint();
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

  const dataSourceMaker = (datas) => {
    const recodes = datas.map((data) => {
      return new Record(data);
    });
    const invoice = new Invoice(recodes);
    return {invoice: invoice,
      dataSource: new sheet.Bindings.CellBindingSource(invoice)};
  };

  const createBorderStyle = (useBorder) => {
    const tableStyle = new sheets.Tables.TableTheme();
    const thinBorder = undefined;
    if (useBorder) {
      thinBorder = new sheets.LineBorder('black', 1);
    }
    tableStyle.wholeTableStyle(new sheets.Tables.TableStyle(
        undefined, undefined, undefined, thinBorder,
        thinBorder, thinBorder, thinBorder, thinBorder, thinBorder));
    return tableStyle;
  };

  /**
   * @param {int} reportId designer를 등록 할 reportId
   * @param {Object} prevDesigner 이전 Designer 객체
   * @param {Object} config ribbon 설정 객체 - 처음 SpreadContent에서만 생성 이후 state에서 불러옴
   */
  const createDesigner = ({reportId, prevDesigner, config}) => {
    if (prevDesigner) prevDesigner.destroy();
    if (_.isEmpty(config)) config = selectExcelConfig(store.getState());

    const designer =
    new sheets.Designer
        .Designer(document.getElementById('spreadWrapper'),
            config);
    dispatch(setDesigner({
      reportId: reportId,
      designer: designer
    }));
    sheetNameChangedListener(designer);
    sheetChangedListener(designer);
  };

  const createExcelFile = () => {
    createReportBlob().then(
        (bolb) => uploadFile(
            bolb,
            {fileName: response.report.reportId + '.xlsx'}
        ));
  };

  const createReportBlob = async () => {
    const designer = selectCurrentDesigner(store.getState());
    const json = designer.getWorkbook().toJSON({includeBindingSource: false});
    const blob = await new Promise((resolve, reject) => {
      excelIO.save(JSON.stringify(json), resolve, reject);
    });
    return blob;
  };

  const setExcelFile = async (data) => {
    const designer = selectCurrentDesigner(store.getState());
    const workBook = designer.getWorkbook();
    const excelIO = selectExcelIO(store.getState());
    const blob = new Blob(
        [data],
        {type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    );
    workBook.suspendPaint();
    const options = {
      excelOpenFlags: {
        ignoreStyle: false,
        ignoreFormula: false,
        frozenColumnsAsRowHeaders: false,
        frozenRowsAsColumnHeaders: false,
        doNotRecalculateAfterLoad: true
      },
      password: ''
    };
    excelIO.open(blob, (json) => {
      workBook.clearSheets();
      const workbookObj = json;
      workBook.fromJSON(workbookObj);
      workBook.resumePaint();
    },
    (e) => {
      console.log(e);
    }, options);
  };

  return {
    bindData,
    sheetChangedListener,
    sheetNameChangedListener,
    createReportBlob,
    createDesigner,
    createExcelFile,
    setExcelFile
  };
};

export default useSpread;
