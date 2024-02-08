// import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {styled} from 'styled-components';
import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useState} from 'react';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
// import Footer from 'components/common/atomic/Modal/molecules/Footer';

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

const LinkParamInfo = ({onClose}) => {
  const [dataSource] = useState();
  // Handlers for OK and Cancel buttons
  const confirm = () => {
    console.log('OK Clicked');
    onClose(); // Close the popup
  };

  const cancel = () => {
    console.log('Cancel Clicked');
    onClose(); // Close the popup
  };
  return (
    <PopupWrapper>
      <StyledWrapper>
        <DevDataGrid
          height={'90%'}
          dataSource={dataSource}
          // columnAutoWidth={true}
          showBorders={true}
          showRowLines={true}
          showColumnLines={true}
          // allowColumnReordering={true}
          // allowColumnResizing={true}
          noDataText="조회된 필터정보가 없습니다."
        >
          <Column dataField="pkNm" caption="원본 보고서 매개변수"/>
          <Column dataField="fkNm" caption="대상 보고서 매개변수"/>
        </DevDataGrid>
      </StyledWrapper>
      <Footer>
        <CommonButton type='primary' maxWidth='120px' onClick={confirm}>
          확인
        </CommonButton>
        <CommonButton type='secondary' maxWidth='120px' onClick={cancel}>
          취소
        </CommonButton>
      </Footer>
    </PopupWrapper>
  );
};

export default LinkParamInfo;
