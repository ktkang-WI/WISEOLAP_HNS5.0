import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos,
  selectCurrentDesigner,
  selectExcelConfig,
  selectExcelIO,
  selectSheets} from 'redux/selector/SpreadSelector';
import useModal from './useModal';
import useReportSave from './useReportSave';
import saveDefaultElement
  from 'components/common/atomic/Ribbon/popover/organism/SaveDefaultElement';
import ribbonDefaultElement
  from 'components/common/atomic/Ribbon/organism/RibbonDefaultElement';
import LoadReportModal from 'components/report/organisms/Modal/LoadReportModal';

const useSpread = () => {
  const sheets = selectSheets(store.getState());
  const dispatch = useDispatch();
  const {setBindingInfo, setDesigner} = SpreadSlice.actions;
  const designer = useSelector(selectCurrentDesigner);
  const bindingInfos = useSelector(selectBindingInfos);
  const reportId = useSelector(selectCurrentReportId);
  const excelIO = useSelector(selectExcelIO);
  const {openModal, alert} = useModal();
  const {reload} = useReportSave();
  const {save} = saveDefaultElement();
  const ribbonElement = ribbonDefaultElement();

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

  const createReportBlob = async () => {
    const designer = selectCurrentDesigner(store.getState());
    const json = designer.getWorkbook().toJSON({includeBindingSource: false});
    const blob = await new Promise((resolve, reject) => {
      excelIO.save(JSON.stringify(json), resolve, reject);
    });
    return blob;
  };

  /**
   * @param {Object} config spreadSlice의 config 객체
   */
  const createDesigner = ({reportId, config, prevDesigner}) => {
    if (!_.isEmpty(prevDesigner)) prevDesigner.destroy();

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
        (bolb) => fileUpload(
            bolb,
            {fileName: response.report.reportId + '.xlsx'}
        ));
  };

  // spreadRibbon에 사용되는 모든 hook을 여기서 관리 추가적으로 다른 hook을 가져올 경우 SpreadDefault에서 호출
  // 다른 커스텀 훅에서 사용되는 모든 useSpread내의 훅은 store.getState()로 가져와서 사용
  // 참조를 던지면 값이 안 변하는 이슈가 있음으로.
  // SpreadDefaultElement -> useSpread

  const executeNew = (context) => {
    const config = selectExcelConfig(store.getState());
    reload();
    createDesigner({
      reportId: 0,
      config: config,
      prevDesigner: context
    });
  };

  const openReportLocal =(context) => {
    const sheets = selectSheets(store.getState());
    sheets.Designer.getCommand('fileMenuPanel')
        .execute(context, 'button_import_excel', null);
  };

  const openReport = () => {
    openModal(LoadReportModal);
  };

  const saveReport = () => {
    save[0].onClick({createExcelFile: createExcelFile});
  };

  const saveAsReport = () => {
    save[1].onClick();
  };

  const deleteReport = () => {
    ribbonElement['DeleteReport'].onClick();
  };

  const downloadReportXLSX = () => {
    let reportNm = selectCurrentReport(store.getState()).options.reportNm;
    const sheets = selectSheets(store.getState());
    const designer = selectCurrentDesigner(store.getState());
    const excelIO = selectExcelIO(store.getState());

    reportNm = reportNm.replaceAll(/[\s\/\\:*?"<>]/gi, '_');
    // 예외 처리 및  메소드 분리.
    sheets.Designer.showDialog('downlaodReportDialog',
        {
          extName: '.xlsx',
          fileName: reportNm,
          designer: designer,
          excelIO: excelIO
        },
        xlsxDownload
    );
  };

  const xlsxDownload = (e) => {
    if (e.fileName === '') {
      alert('파일명을 입력해 주세요.');
    } else {
      if (e.fileName
          .substr(-e.extName.length, e.extName.length) !== e.extName) {
        e.fileName += e.extName;
      }
      const fileName = e.fileName;
      const json = JSON.stringify(
          e.designer.getWorkbook().toJSON({includeBindingSource: true}));
      e.excelIO.save(json, (blob) => {
        saveAs(blob, fileName);
      }, (e) => {
        console.log(e);
      });
    }
  };

  const downloadReportTXT = () => {

  };

  const datasetBinder = () => {
    const datasets = selectCurrentDatasets(store.getState());
    if (datasets.length == 0) {
      alert(localizedString.dataSourceNotSelectedMsg);
      return;
    }
    openModal(DatasetLinkerModal);
  };

  const print = () => {
    const designer = selectCurrentDesigner(store.getState());
    const workbook = designer.getWorkbook();
    const activeSheet = workbook.getActiveSheet();
    activeSheet.printInfo().margin(
        {top: 10, bottom: 10, left: 10, right: 10, header: 10, footer: 10}
    );
    const index = workbook.getActiveSheetIndex();
    workbook.print(index);
  };

  const addSpreadTemplate = (templateName, templateMethod) => {
    const sheets = selectSheets(store.getState());
    sheets.Designer.registerTemplate(templateName, templateMethod);
  };

  return {
    bindData,
    sheetChangedListener,
    sheetNameChangedListener,
    createReportBlob,
    createDesigner,
    createExcelFile,
    executeNew,
    openReportLocal,
    openReport,
    saveReport,
    saveAsReport,
    deleteReport,
    downloadReportXLSX,
    downloadReportTXT,
    datasetBinder,
    print,
    addSpreadTemplate
  };
};

export default useSpread;
