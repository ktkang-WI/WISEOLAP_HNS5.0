import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {styled} from 'styled-components';
import localizedString from 'config/localization';

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
  onSubmit, onPrev, onNext, onClose, maxPage, currentPage, usePage,
  onDelete, ...props
}) => {
  const onConfirm = async () => {
    if (!await onSubmit()) {
      onClose();
    }
  };

  const onRemove = () => {
    onDelete();
    onClose();
  };

  return (
    <ButtonWrapper>
      {usePage && currentPage != 1 &&
        <CommonButton width="60px" onClick={onPrev} visible>
          {localizedString.previous}
        </CommonButton>
      }
      {usePage && currentPage != maxPage &&
        <CommonButton width="60px" onClick={onNext} visible>
          {localizedString.next}
        </CommonButton>
      }
      {
        (!usePage || (usePage && currentPage == maxPage)) && onSubmit &&
        <CommonButton width="60px" onClick={onConfirm}>
          {localizedString.confirm}
        </CommonButton>
      }
      <CommonButton width="60px" onClick={onClose}>
        {onSubmit? localizedString.cancel : localizedString.confirm}
      </CommonButton>
      { onDelete &&
      <CommonButton width="60px" onClick={onRemove}>
        {onDelete? '삭제' : '삭제'}
      </CommonButton>
      }
    </ButtonWrapper>
  );
};

export default Footer;
