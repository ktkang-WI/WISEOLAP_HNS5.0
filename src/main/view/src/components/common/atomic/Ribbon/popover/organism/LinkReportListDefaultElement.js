import {selectLinkedReport} from 'redux/selector/LinkSelector';
import store from 'redux/modules';
import styled from 'styled-components';
import CommonButton from '../../../Common/Button/CommonButton';
import {
  // getSubLinkDim,
  connectLinkedReport}
  from 'components/report/util/LinkedReportUtility';
import {
  selectCurrentValues
} from 'redux/selector/ParameterSelector';
import {useSelector} from 'react-redux';
// import useModal from 'hooks/useModal';

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
  const currentParameterValues = useSelector(selectCurrentValues);

  if (!linkReportList || Object.keys(linkReportList).length === 0) {
    return;
  } else {
    return (
      <ButtonColumn>
        {Object.values(linkReportList).map((report, index) => (
          <ButtonWrapper key={report.linkReportId || index}>
            <CommonButton
              key={report.linkReportId || index}
              height={'28px'}
              type='onlyImageText'
              onClick={() => {
                const param = {
                  reportId: report.linkReportId,
                  reportType: report.linkReportType,
                  newWindowLinkParamInfo:
                    report.linkParamInfo.map((linkParam) => {
                      const paramKey = linkParam.pkParam;
                      // linkParam 객체를 얕은 복사하여 새로운 객체를 반환
                      const newLinkParam = {...linkParam};
                      if (currentParameterValues.hasOwnProperty(paramKey)) {
                        // 불변성을 유지하면서 value 값을 새로운 객체에 추가
                        newLinkParam['value'] =
                          currentParameterValues[paramKey].value;
                      }
                      return newLinkParam;
                    })
                };
                connectLinkedReport(param, true);
              }}
            >
              {report.linkReportNm}
            </CommonButton>
          </ButtonWrapper>
        ))}
      </ButtonColumn>
    );
  }
};

export default LinkReportListDefaultElement;
