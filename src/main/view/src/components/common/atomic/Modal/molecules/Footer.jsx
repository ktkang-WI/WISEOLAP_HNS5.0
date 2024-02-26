import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {styled} from 'styled-components';
import localizedString from 'config/localization';

const ButtonWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;
  padding: 0px 30px;
  padding-bottom: 20px;
  bottom: 0px;
`;

const Footer = ({
  onSubmit, onPrev, onNext, onClose, maxPage, currentPage, usePage, buttons=[],
  ...props
}) => {
  const onConfirm = async () => {
    if (!await onSubmit()) {
      onClose();
    }
  };

  return (
    <ButtonWrapper>
      {usePage && currentPage != 1 &&
        <CommonButton width="180px" onClick={onPrev} visible>
          {localizedString.previous}
        </CommonButton>
      }
      {usePage && currentPage != maxPage &&
        <CommonButton width="180px" onClick={onNext} visible>
          {localizedString.next}
        </CommonButton>
      }
      {
        (!usePage || (usePage && currentPage == maxPage)) && onSubmit &&
        <CommonButton width="180px" onClick={onConfirm}>
          {localizedString.confirm}
        </CommonButton>
      }
      <CommonButton width={onSubmit ? '180px': '100%'} onClick={onClose}
        type={onSubmit ? 'secondary' : 'primary'}>
        {onSubmit ? localizedString.cancel : localizedString.confirm}
      </CommonButton>
      {
        buttons.map((button, i) => (
          <CommonButton width="180px"
            key={i}
            onClick={async () => {
              if (!await button.onClick()) {
                onClose();
              }
            }}>
            {button.text}
          </CommonButton>
        ))
      }
    </ButtonWrapper>
  );
};

export default Footer;
