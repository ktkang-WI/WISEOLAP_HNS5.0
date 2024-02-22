import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {importFile} from 'models/upload/File';
import localizedString from 'config/localization';
import {sheets, excelIO} from '../util/SpreadCore';
import useReportSave from 'hooks/useReportSave';
import {useEffect, useRef} from 'react';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {excelIOOpenOtions} from '../util/spreadContants';

const SpreadViewer = () => {
  const report = useSelector(selectCurrentReport);
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
    const prevWorkBook = sheets.findControl(sheetsRef.current);
    if (prevWorkBook) prevWorkBook.destroy();
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
                  excelIOOpenOtions);
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
