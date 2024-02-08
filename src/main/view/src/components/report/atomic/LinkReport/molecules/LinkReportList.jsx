import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import SmallImageButton
  from 'components/common/atomic/Common/Button/SmallImageButton';
import paramConnect
  from 'assets/image/icon/button/ico_connectReportSettings.png';
import Popup from 'devextreme-react/popup';
// import useModal from 'hooks/useModal';
import LinkParamInfo
  from 'components/report/atomic/LinkReport/molecules/LinkParamInfo';

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

const LinkReportList = ({width, dataSource}) => {
  const dxRef = useRef();
  const [popupVisible, setPopupVisible] = useState(false);
  // const {openModal} = useModal();
  const currentReportId = useSelector(selectCurrentReportId);
  console.log('currentReportId', currentReportId);
  console.log('LinkReportList dataSource', dataSource);
  // if (currentReportId !== 0) {
  //   getLinkReportList(currentReportId).then((response) => {
  //     if (response.status != 200) {
  //       return;
  //     }
  //     console.log('response', response);
  //   });
  // } else if (currentReportId == 0) {

  // }

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
          onClick={() => setPopupVisible(true)}
        />
      </Title>
      <DevDataGrid
        height={'90%'}
        ref={dxRef}
        dataSource={dataSource}
        // columnAutoWidth={true}
        showBorders={true}
        showRowLines={true}
        showColumnLines={true}
        // allowColumnReordering={true}
        // allowColumnResizing={true}
      >
        <Column dataField="name" caption="연결 보고서 목록" />
      </DevDataGrid>
      <Popup
        visible={popupVisible}
        onHiding={() => setPopupVisible(false)}
        dragEnabled={true}
        // closeOnOutsideClick={true}
        showCloseButton={true}
        title="연결보고서 데이터 설정"
        width="600px"
        height="400px"
      >
        <LinkParamInfo />
      </Popup>
    </Wrapper>
  );
};

export default LinkReportList;
