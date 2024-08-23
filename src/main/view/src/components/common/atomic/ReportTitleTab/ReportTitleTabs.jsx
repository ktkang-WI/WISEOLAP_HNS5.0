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
import {deleteWorkbookJSON}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useEffect, useState} from 'react';

const Wrapper = styled.div`
  width: calc(100vw - ${(props) => props.width}px);
  height: 54px;
  display: flex;
  min-width: 200px;
  // position: absolute;
  top: 8px;
  left: 350px;
  flex-wrap: nowrap; /* 줄넘김을 하지 않도록 설정 */
  box-sizing: border-box;
`;

// TODO: 추후 데이터 연동시 수정 예정
const ReportTitleTabs = () => {
  const dispatch = useDispatch();
  const {closeReport} = useReportSave();
  const [distance, setDistance] = useState(0);

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

  useEffect(() => {
    let widthSum = 0;
    const leftRight =
      ['designer', 'downLoadReport', 'user_info_popover', 'save_as'];

    leftRight.map((id) => {
      const element = document.getElementById(id);
      const rect = element.getBoundingClientRect();
      widthSum += rect.width;
    });
    // 로고 길이 까지
    setDistance(widthSum + 110);
  }, []);

  return (
    <Wrapper
      width={distance}
    >
      {reports.map((report) =>
        <ReportTitleTab
          title={report.options.reportNm}
          key={report.reportId}
          onClick={() => onClick(report)}
          onDelete={
            editMode == EditMode.VIEWER ?
            (() => {
              closeReport(report.reportId);
              deleteWorkbookJSON(report.reportId);
            }) :
            undefined
          }
          selected={report.reportId == selectedReportId}
        >
          {report.options.reportNm}
        </ReportTitleTab>
      )}
    </Wrapper>
  );
};

export default ReportTitleTabs;
