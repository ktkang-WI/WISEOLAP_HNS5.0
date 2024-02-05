import {styled} from 'styled-components';
import ReportTitleTab from './molecules/ReportTitleTab';
import {selectCurrentReportId, selectReports}
  from 'redux/selector/ReportSelector';
import {useSelector, useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import ReportSlice from 'redux/modules/ReportSlice';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import useReportSave from 'hooks/useReportSave';
import {EditMode} from 'components/config/configType';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 200px;
  @media screen and (max-width: 720px) {
    display: none;
  }
`;

// TODO: 추후 데이터 연동시 수정 예정
const ReportTitleTabs = () => {
  const dispatch = useDispatch();
  const {closeReport} = useReportSave();

  let reports = useSelector(selectReports);
  const selectedReportId = useSelector(selectCurrentReportId);
  const editMode = useSelector(selectEditMode);

  const {setDesignerMode} = ConfigSlice.actions;
  const {selectReport} = ReportSlice.actions;

  if (editMode == EditMode.VIEWER) {
    reports = reports.filter((report) => report.reportId != 0);
  }

  const onClick = ({reportId, options}) => {
    if (editMode == EditMode.DESIGNER) return;

    if (reports.length > 0 && reportId != selectedReportId) {
      dispatch(setDesignerMode(options.reportType));
      dispatch(selectReport(reportId));
    }
  };

  return (
    <Wrapper>
      {reports.map((report) =>
        <ReportTitleTab
          key={report.reportId}
          onClick={() => onClick(report)}
          onDelete={() => closeReport(report.reportId)}
        >
          {report.options.reportNm}
        </ReportTitleTab>
      )}
    </Wrapper>
  );
};

export default ReportTitleTabs;
