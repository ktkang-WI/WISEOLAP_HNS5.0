import {styled} from 'styled-components';
import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {
  useEffect,
  useState,
  useRef
} from 'react';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import store from 'redux/modules';
import {useDispatch} from 'react-redux';
import LinkSlice from 'redux/modules/LinkSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {checkLinkReport} from 'redux/selector/LinkSelector';
import {processLinkParamData, createLinkDataXML}
  from 'components/report/atomic/LinkReport/molecules/LinkReportFunction';

const PopupWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledWrapper = styled(Wrapper)`
  width: 100%;
  height: 94%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  height: 6%;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
`;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const LinkParamInfo = ({
  selectedRowData,
  linkParamData,
  onClose,
  paramInfo,
  setParamInfo
}) => {
  const [fkNmOptions, setFkNmOptions] = useState([]);
  const dispatch = useDispatch();
  const {insertLink, updateLink} = LinkSlice.actions;
  const prevLinkParamData = usePrevious(linkParamData);
  const checkLinkReportList = checkLinkReport(store.getState());

  useEffect(() => {
    if (linkParamData &&
        JSON.stringify(linkParamData) !== JSON.stringify(prevLinkParamData)) {
      if (checkLinkReportList.hasOwnProperty(selectedRowData.id)) {
        processLinkParamData(
            checkLinkReportList[selectedRowData.id],
            setParamInfo,
            setFkNmOptions
        );
      } else {
        processLinkParamData(linkParamData, setParamInfo, setFkNmOptions);
      }
    }
  }, [linkParamData, prevLinkParamData, setParamInfo]);

  const linkReportInfo = {
    reportId: 0,
    linkReportId: 0,
    linkXml: '',
    linkParamInfo: [],
    linkReportOrdinal: 0,
    linkReportType: '',
    dataLinkType: 'LP'
  };
  const confirm = () => {
    const checkLinkReportList = checkLinkReport(store.getState());
    const linkReportId = linkParamData.reports[0].reportId;
    const currentReportId = selectCurrentReportId(store.getState());
    const currentReportType = selectCurrentDesignerMode(store.getState());
    const dataPairs = paramInfo.map((info) => ({
      FK_COL_NM: info.fkParam,
      PK_COL_NM: info.pkParam
    }));
    const linkXml = createLinkDataXML(dataPairs);

    linkReportInfo.reportId = currentReportId;
    linkReportInfo.linkReportId = linkReportId;
    linkReportInfo.linkXml = linkXml;
    linkReportInfo.linkParamInfo = paramInfo;
    linkReportInfo.linkReportType = currentReportType;

    if (!checkLinkReportList.hasOwnProperty(linkReportId)) {
      dispatch(insertLink(linkReportInfo));
    } else {
      dispatch(updateLink(linkReportInfo));
    }
    onClose();
  };
  return (
    <PopupWrapper>
      <StyledWrapper>
        <DevDataGrid
          height={'90%'}
          dataSource={paramInfo}
          showBorders={true}
          showRowLines={true}
          showColumnLines={true}
          noDataText="조회된 필터정보가 없습니다."
          editing={{
            mode: 'cell',
            allowUpdating: true
          }}
          onRowUpdated={(e) => {
            const newData = paramInfo.map((item) => {
              if (item.pkNm === e.key.pkNm) {
                const selectedOption = fkNmOptions.find(
                    (option) => option.fkNm === e.data.fkNm
                );
                return {
                  ...item,
                  fkNm:
                    selectedOption ? selectedOption.fkNm : item.fkNm,
                  fkParam:
                    selectedOption ? selectedOption.fkParam : item.fkParam
                };
              }
              return item;
            });
            setParamInfo(newData);
          }}
        >
          <Column dataField="pkNm" caption="원본 보고서 매개변수"/>
          <Column
            dataField="fkNm"
            caption="대상 보고서 매개변수"
            lookup={
              {
                dataSource: fkNmOptions,
                valueExpr: 'fkNm',
                displayExpr: 'caption'
              }
            }
            allowEditing={true}
          />
        </DevDataGrid>
      </StyledWrapper>
      <Footer>
        <CommonButton type='primary' maxWidth='120px' onClick={confirm}>
          확인
        </CommonButton>
        <CommonButton type='secondary' maxWidth='120px' onClick={onClose}>
          취소
        </CommonButton>
      </Footer>
    </PopupWrapper>
  );
};

export default LinkParamInfo;
