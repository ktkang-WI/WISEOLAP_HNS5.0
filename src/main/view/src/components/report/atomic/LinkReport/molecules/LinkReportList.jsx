import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import {useRef, useState} from 'react';
import SmallImageButton
  from 'components/common/atomic/Common/Button/SmallImageButton';
import paramConnect
  from 'assets/image/icon/button/ico_connectReportSettings.png';
import Popup from 'devextreme-react/popup';
import models from 'models';
import LinkParamInfo
  from 'components/report/atomic/LinkReport/molecules/LinkParamInfo';
import useModal from 'hooks/useModal';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${(props) => props.width || theme.size.panelWidth};
  display: inline-block;
  border: solid 1px ${theme.color.breakLine};
  text-align: left;
`;

const Title = styled.div`
  font-size: 20px;
  color: ${theme.color.primaryFont};
  padding: 0 10px;
  margin-bottom: 10px;
`;

const LinkReportList = (
    {
      width,
      dataSource,
      onSelectionChange,
      subYn,
      subLinkDim
    }
) => {
  const dxRef = useRef();
  const [popupVisible, setPopupVisible] = useState(false);
  const {alert} = useModal();
  const [selectedRowData, setSelectedRowData] = useState();
  const [linkParamData, setLinkParamData] = useState();
  const [paramInfo, setParamInfo] = useState([]);
  const [linkFkInfo, setLinkFkInfo] = useState([]);
  const [subLinkFkInfo, setSubLinkFkInfo] = useState([]);
  const [subLinkParamInfo, setSubLinkParamInfo] = useState([]);

  const handleOpenPopup = async () => {
    if (selectedRowData &&
        selectedRowData.id !== linkParamData?.reports[0]?.reportId) {
      const param = {reportId: selectedRowData.id};
      models.Report.getLinkReportParam(param).then(({data}) => {
        setLinkParamData(data);
        setPopupVisible(true);
      });
    } else if (selectedRowData &&
      selectedRowData.id == linkParamData?.reports[0]?.reportId) {
      setPopupVisible(true);
    } else {
      alert('연결 보고서를 선택해주세요.');
    };
  };

  return (
    <Wrapper
      width={width}
    >
      <Title
        height={'30%'}
      >
        연결 보고서
        <SmallImageButton
          src={paramConnect}
          imgWidth='40px'
          imgHeight='auto'
          buttonWidth='40px'
          buttonHeight='40px'
          onClick={handleOpenPopup}
        />
      </Title>
      <DevDataGrid
        height={'90%'}
        ref={dxRef}
        dataSource={dataSource}
        showBorders={false}
        showRowLines={false}
        showColumnLines={false}
        selection={
          {
            mode: 'single',
            showCheckBoxesMode: 'onClick'
          }
        }
        onSelectionChanged={(selectionChangedEvent) => {
          const selectedRow = selectionChangedEvent.selectedRowsData[0];
          if (selectedRow) {
            setSelectedRowData(selectedRow);
            onSelectionChange(selectedRow);
          }
        }}
      >
        <Column dataField="name" caption="연결 보고서 목록" />
      </DevDataGrid>
      <Popup
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        dragEnabled={true}
        showCloseButton={true}
        title="연결보고서 데이터 설정"
        width='600px'
        height={subYn ? '800px' : '400px'}
      >
        <LinkParamInfo
          selectedRowData = {selectedRowData}
          linkParamData={linkParamData}
          onClose={() => setPopupVisible(false)}
          paramInfo={paramInfo}
          setParamInfo={setParamInfo}
          subYn={subYn}
          subLinkDim={subLinkDim}
          subLinkParamInfo={subLinkParamInfo}
          setSubLinkParamInfo={setSubLinkParamInfo}
          linkFkInfo={linkFkInfo}
          setLinkFkInfo={setLinkFkInfo}
          subLinkFkInfo={subLinkFkInfo}
          setSubLinkFkInfo={setSubLinkFkInfo}
        />
      </Popup>
    </Wrapper>
  );
};

export default LinkReportList;
