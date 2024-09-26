import {selectLinkedReport} from 'redux/selector/LinkSelector';
import store from 'redux/modules';
import styled from 'styled-components';
import CommonButton from '../../../Common/Button/CommonButton';
import {
  // getSubLinkDim,
  connectLinkedReport}
  from 'components/report/util/LinkedReportUtility';

const ButtonWrapper = styled.div`
  padding: 6px 16px;
  border: 1px solid black;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const ButtonColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const LinkReportListDefaultElement = () => {
  const linkReportList = selectLinkedReport(store.getState());

  if (!linkReportList || Object.keys(linkReportList).length === 0) {
    alert('연결 보고서가 존재하지 않습니다.');
    return null;
  }
  return (
    <ButtonColumn>
      {Object.values(linkReportList).map((report, index) => (
        <ButtonWrapper key={report.linkReportId || index}>
          <CommonButton
            key={report.linkReportId || index}
            height={'28px'}
            type='onlyImageText'
            onClick={() => {
              console.log(`Selected Report Name: ${report.linkReportNm}`);
              console.log(`Selected Report ID: ${report.linkReportId}`);
              console.log('Full Report Object:', report);
              const param = {
                reportId: report.linkReportId,
                // reportNm: report.linkReportNm,
                reportType: report.linkReportType,
                parentReportId: report.reportId,
                // parentReportNm: report.reportNm,
                parentReportType: report.reportType,
                // linkFkInfo: report.linkFkInfo,
                // linkParamInfo: report.linkParamInfo,
                promptYn: 'N',
                linkNewTab: false
              };
              console.log('Param:', param);
              connectLinkedReport(param, true, true);
            }}
          >
            {report.linkReportNm}
          </CommonButton>
        </ButtonWrapper>
      ))}
    </ButtonColumn>
  );
};

export default LinkReportListDefaultElement;
