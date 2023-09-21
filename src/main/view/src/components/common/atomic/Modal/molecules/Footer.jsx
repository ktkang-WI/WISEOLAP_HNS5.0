import CommonButton from 'components/common/atoms/CommonButton';
import {styled} from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  justify-content: end;
  align-items: center;
  padding: 0px 40px;
  padding-bottom: 20px;
  position: absolute;
  bottom: 0px;
`;

const Footer = ({
  onSubmit, onPrev, onNext, onClose, maxPage, currentPage, usePage
}) => {
  const onConfirm = () => {
    onSubmit();
    onClose();
  };

  return (
    <ButtonWrapper>
      {usePage && currentPage != 1 &&
        <CommonButton width="60px" onClick={onPrev} visible>이전</CommonButton>
      }
      {usePage && currentPage != maxPage &&
        <CommonButton width="60px" onClick={onNext} visible>다음</CommonButton>
      }
      {
        (!usePage || (usePage && currentPage == maxPage)) &&
        <CommonButton width="60px" onClick={onConfirm}>확인</CommonButton>
      }
      <CommonButton width="60px" onClick={onClose}>취소</CommonButton>
    </ButtonWrapper>
  );
};

export default Footer;
