import PanelTitleText from './PanelTitleText';
import SmallImageButton from '../Button/SmallImageButton';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import getElement from './PanelTitleDefaultElement';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.white};
  width: 100%;
  height: ${theme.size.tabHeaderHeight};
  padding: 0px 15px;
  text-align: left;
  border-bottom: 1px solid ${theme.color.gray100};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Buttons = styled.div`
  float: right;
`;

const PanelTitle = ({panelTitle, buttons}) => {
  const panelTitleDefaultElement = getElement();


  const getButton = (button) => {
    return (
      <SmallImageButton
        key={button.id}
        title={button.label}
        onClick={button.onClick}
        src={button.src}
        {...button}
      >
      </SmallImageButton>
    );
  };

  const generateButtons = (buttons) => {
    if (!buttons) return;

    return buttons.map((button) => {
      if (typeof button === 'string') {
        return getButton(panelTitleDefaultElement[button]);
      } else {
        return getButton(button);
      }
    });
  };

  return (
    <Wrapper>
      <PanelTitleText fontWeight={500}>{panelTitle}</PanelTitleText>
      <Buttons>
        {generateButtons(buttons)}
      </Buttons>
    </Wrapper>
  );
};

export default PanelTitle;
