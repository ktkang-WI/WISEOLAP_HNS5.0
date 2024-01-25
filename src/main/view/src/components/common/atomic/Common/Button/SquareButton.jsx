import {styled} from 'styled-components';
import SmallButtonImage from '../Image/SmallButtonImage';
import SmallButtonLabel from '../Label/SmallButtonLabel';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 5px;
  border: 1px solid ${theme.color.breakLine};
  flex-direction: column;
  word-break: keep-all;
  cursor: pointer;

  &:hover {
    background: ${theme.color.secondaryGradient}
  }

  & + & {
    margin-left: 0px;
  }

  div {
    line-height: 12px;
  }

  img + div {
    margin-top: 5px;
  }

  ${(props) => props.active && `
    box-shadow: inset 0 0 0px 0.5px ${theme.color.primary};
    border: 1px solid ${theme.color.primary};
  `}
`;

const SquareButton = ({
  icon,
  label,
  width='100%',
  height='100%',
  onClick,
  active
}) => {
  return (
    <Wrapper onClick={onClick} active={active}>
      <SmallButtonImage src={icon}></SmallButtonImage>
      <SmallButtonLabel>{label}</SmallButtonLabel>
    </Wrapper>
  );
};

export default SquareButton;
