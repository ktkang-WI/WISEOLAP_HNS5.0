import {styled} from 'styled-components';
import SmallImageButton
  from 'components/common/atomic/Common/Button/SmallImageButton';
import addArrow from 'assets/image/icon/button/arrow_right.png';
import removeArrow from 'assets/image/icon/button/arrow_left.png';

const Wrapper = styled.div`
  height: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 100px;
  align-items: flex-start;
  justify-content: center;
`;

const LinkReportRibbon = ({width, onAddButtonClick}) => {
  return (
    <Wrapper
      width={width}
    >
      <SmallImageButton
        src={addArrow}
        imgWidth='20px'
        imgHeight='auto'
        buttonWidth='20px'
        buttonHeight='20px'
        onClick={onAddButtonClick}
      />
      <SmallImageButton
        src={removeArrow}
        imgWidth='20px'
        imgHeight='auto'
        buttonWidth='20px'
        buttonHeight='20px'
        // onClick={}
      />
    </Wrapper>
  );
};
export default LinkReportRibbon;

