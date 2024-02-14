import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {importFile} from 'models/upload/File';
import localizedString from 'config/localization';
import {selectExcelIO, selectSheets} from 'redux/selector/SpreadSelector';
import useReportSave from 'hooks/useReportSave';
import {useEffect, useRef} from 'react';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const SpreadViewer = () => {
  const report = useSelector(selectCurrentReport);
  const excelIO = useSelector(selectExcelIO);
  const sheets = useSelector(selectSheets);
  const sheetsRef = useRef();
  const {alert} = useModal();
  const {querySearch} = useReportSave();

  const createBlob = (data) => {
    const blob = new Blob(
        [data],
        {type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    );
    return blob;
  };

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

  const successFunc = (json, workbook) => {
    workbook.clearSheets();
    const workbookObj = json;
    workbook.fromJSON(workbookObj);
    querySearch();
  };

  const errorFunc = () => {
    alert(localizedString.reportCorrupted);
  };

  useEffect(() => {
    const prevWorkbook = sheets.findControl(sheetsRef.current);
    if (prevWorkbook) prevWorkbook.destroy();
    const workbook = new sheets.Workbook(sheetsRef.current);
    importFile({fileName: report.reportId + '.xlsx'})
        .then(
            (response) => {
              if (response.status !== 200) {
                alert(localizedString.noneExcelFile);
                return;
              }
              const blob = createBlob(response.data);
              excelIO.open(blob,
                  (json) => successFunc(json, workbook),
                  errorFunc,
                  options);
            })
        .catch((e) => {
          alert(localizedString.noneExcelFile);
        });
  }, [report]);

  return (
    <Wrapper
      ref={sheetsRef}
    >
    </Wrapper>
  );
};

export default SpreadViewer;
