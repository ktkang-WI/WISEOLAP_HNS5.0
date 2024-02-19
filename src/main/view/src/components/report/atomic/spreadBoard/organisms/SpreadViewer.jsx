import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {importFile} from 'models/upload/File';
import localizedString from 'config/localization';
import {selectExcelIO, selectSheets} from 'redux/selector/SpreadSelector';
import useReportSave from 'hooks/useReportSave';
import {useEffect, useRef} from 'react';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
  border: 1px solid ${theme.color.gray200};
  border-radius: 10px;
  overflow: hidden !important;
  text-align: left;
`;

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

  const successFunc = (json, workBook) => {
    workBook.clearSheets();
    const workBookObj = json;
    workBook.fromJSON(workBookObj);
    querySearch();
  };

  const errorFunc = () => {
    alert(localizedString.reportCorrupted);
  };

  useEffect(() => {
    const prevWorkBook = sheets.findControl(sheetsRef.current);
    if (prevWorkBook) prevWorkBook.destroy();
    const workBook = new sheets.Workbook(sheetsRef.current);
    importFile({fileName: report.reportId + '.xlsx'})
        .then(
            (response) => {
              if (response.status !== 200) {
                alert(localizedString.noneExcelFile);
                return;
              }
              const blob = createBlob(response.data);
              excelIO.open(blob,
                  (json) => successFunc(json, workBook),
                  errorFunc,
                  options);
            })
        .catch((e) => {
          alert(localizedString.noneExcelFile);
        });
  }, [report]);

  return (
    <StyledWrapper
      className='section board'
      ref={sheetsRef}
    >
    </StyledWrapper>
  );
};

export default SpreadViewer;
