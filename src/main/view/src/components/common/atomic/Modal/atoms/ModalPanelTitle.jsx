import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';

const theme = getTheme();

const TitleWrapper = styled.div`
  width: 100%;
  height: 32px;
  display: block;
  padding-bottom: 5px;
  line-height: 32px;
  font: ${theme.font.modalTitle};
  color: ${theme.color.primary};
  border-bottom: solid 1px ${theme.color.breakLine};
  text-align: left;
`;

const Buttons = styled.div`
  float: right;
  position: relative;
  display: flex;
`;

const ModalPanelTitle = ({buttons = [], children}) => {
  const generateButtons = () => {
    return buttons.map((button, i) => (
      <CommonButton
        key={'modal-button' + i}
        {...button}
      >
        {button.text}
      </CommonButton>
    ));
  };

  return (
    <TitleWrapper>
      {children}
      <Buttons>
        {generateButtons()}
      </Buttons>
    </TitleWrapper>
  );
};

export default ModalPanelTitle;
