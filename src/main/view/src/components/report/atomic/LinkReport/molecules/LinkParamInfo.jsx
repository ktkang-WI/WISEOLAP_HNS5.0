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
import {
  // processSubLinkParamData,
  processLinkParamData,
  createLinkDataXML
}
  from 'components/report/atomic/LinkReport/molecules/LinkReportFunction';
import {selectSelectedItemId, selectCurrentItemType}
  from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';

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
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  height: 6%;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
`;

const StyledTitle = styled.div`
  display: block;
  font-size: 1rem;
  color: #577df6;
  border-bottom: 1px solid #e7e7e7;
  line-height: 1.5;
  margin-bottom: 15px;
  font-weight: 500;
  margin-top: ${({marginTop}) => marginTop || '0'};
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
  setParamInfo,
  subYn,
  subLinkDim,
  subLinkParamInfo,
  setSubLinkParamInfo,
  linkFkInfo,
  setLinkFkInfo,
  subLinkFkInfo,
  setSubLinkFkInfo
}) => {
  const [fkNmOptions, setFkNmOptions] = useState([]);
  const [subFkNmOptions, setSubFkNmOptions] = useState([]);
  const dispatch = useDispatch();
  const {insertLink, updateLink} = LinkSlice.actions;
  const prevLinkParamData = usePrevious(linkParamData);
  const checkLinkReportList = checkLinkReport(store.getState());
  const focusedItemId = useSelector(selectSelectedItemId);
  const focusedItemType = useSelector(selectCurrentItemType);

  useEffect(() => {
    console.log('linkParamData', linkParamData);
    if (linkParamData &&
        JSON.stringify(linkParamData) !== JSON.stringify(prevLinkParamData)) {
      if (checkLinkReportList.hasOwnProperty(selectedRowData.id)) {
        processLinkParamData(
            checkLinkReportList[selectedRowData.id],
            setParamInfo,
            setFkNmOptions,
            linkFkInfo,
            setLinkFkInfo,
            subLinkParamInfo,
            setSubLinkParamInfo,
            setSubFkNmOptions,
            subLinkDim,
            subYn
        );
      } else {
        processLinkParamData(
            linkParamData,
            setParamInfo,
            setFkNmOptions,
            linkFkInfo,
            setLinkFkInfo,
            subLinkParamInfo,
            setSubLinkParamInfo,
            setSubFkNmOptions,
            subLinkDim,
            subYn
        );
      }
    }
  }, [
    linkParamData,
    prevLinkParamData,
    setParamInfo,
    setLinkFkInfo
    // setSubLinkParamInfo
  ]
  );

  const subLinkInfo = {
    reportId: 0,
    linkReportId: 0,
    subLinkItemId: '',
    dataLinkType: 'LP',
    subLinkXmlParam: '',
    subLinkXmlData: '',
    subLinkReportOrdinal: 0,
    subLinkReportType: '',
    subLinkParamInfo: []
  };
  const linkReportInfo = {
    reportId: 0,
    linkReportId: 0,
    linkXmlParam: '',
    linkReportOrdinal: 0,
    linkReportType: '',
    dataLinkType: 'LP',
    linkParamInfo: [],
    linkFkInfo: [],
    // subLinkReport Parameter Point
    subYn: 'False',
    subLinkReport: subLinkInfo
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
    const linkXmlParam = createLinkDataXML(dataPairs);
    let subDataPairs;
    if (subYn) {
      subDataPairs = subLinkParamInfo.map((info) => ({
        FK_COL_NM: info.fkParam === undefined ? 'None' : info.fkParam,
        PK_COL_NM: info.pkParam
      }));
    }

    linkReportInfo.reportId = currentReportId;
    linkReportInfo.linkReportId = linkReportId;
    linkReportInfo.linkXmlParam = linkXmlParam;
    linkReportInfo.linkReportType = currentReportType;
    linkReportInfo.linkParamInfo = paramInfo;
    linkReportInfo.linkFkInfo = linkFkInfo;
    if (subYn) {
      linkReportInfo.subYn = 'True';
      subLinkInfo.reportId = currentReportId;
      subLinkInfo.linkReportId = linkReportId;
      subLinkInfo.subLinkItemId = focusedItemType + focusedItemId;
      subLinkInfo.subLinkXmlParam = linkXmlParam;
      subLinkInfo.subLinkXmlData = createLinkDataXML(subDataPairs);
      subLinkInfo.subLinkReportType = currentReportType;
      subLinkInfo.subLinkParamInfo = subLinkParamInfo;
    }
    if (!checkLinkReportList.hasOwnProperty(linkReportId)) {
      dispatch(insertLink(linkReportInfo));
    } else {
      console.log('updateLink');
      dispatch(updateLink(linkReportInfo));
    }
    onClose();
  };
  return (
    <PopupWrapper>
      <StyledWrapper>
        <StyledTitle>
          매개변수 매핑 정보
        </StyledTitle>
        <DevDataGrid
          height={subYn ? '43%' : '76%'}
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
          <Column
            dataField="pkNm"
            caption="원본 보고서 매개변수"
          />
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
        {subYn && (
          <>
            <StyledTitle marginTop="14px">
              차원 데이터 연결
            </StyledTitle>
            <DevDataGrid
              height={'43%'}
              dataSource={subLinkParamInfo}
              showBorders={true}
              showRowLines={true}
              showColumnLines={true}
              noDataText="조회된 필터정보가 없습니다."
              editing={{
                mode: 'cell',
                allowUpdating: true
              }}
              onRowUpdated={(e) => {
                const newData = subLinkParamInfo.map((item) => {
                  if (item.pkNm === e.key.pkNm) {
                    const selectedOption = subFkNmOptions.find(
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
                setSubLinkParamInfo(newData);
              }}
            >
              <Column
                dataField="pkNm"
                caption="원본 보고서 차원"
              />
              <Column
                dataField="fkNm"
                caption="대상 보고서 매개변수"
                lookup={
                  {
                    dataSource: subFkNmOptions,
                    valueExpr: 'fkNm',
                    displayExpr: 'caption'
                  }
                }
                allowEditing={true}
              />
            </DevDataGrid>
          </>
        )}
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
