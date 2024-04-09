import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';
import {CheckBox} from 'devextreme-react';

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

const ModalPanelTitle = ({
  buttons = [],
  checkBoxs = [],
  children}) => {
  const generateButtons = () => {
    return buttons.map((button, i) => (
      <CommonButton
        key={'modal-button' + i}
        height='30px'
        font={theme.font.modalButton}
        {...button}
      >
        {button.text}
      </CommonButton>
    ));
  };

  const generateCheckBoxs =() => {
    return checkBoxs.map((checkBox, i) => (
      <CheckBox
        key={`modal-checkBox${i}`}
        height='30px'
        text={checkBox.text}
        defaultValue={
          _.isNull(checkBox.value) || _.isUndefined(checkBox.value) ?
          true : checkBox.defaultValue
        }
        onValueChanged={checkBox.onValueChanged}
      />
    ));
  };

  return (
    <TitleWrapper>
      {children}
      <Buttons>
        {generateButtons()}
        {generateCheckBoxs()}
      </Buttons>
    </TitleWrapper>
  );
};

export default ModalPanelTitle;
