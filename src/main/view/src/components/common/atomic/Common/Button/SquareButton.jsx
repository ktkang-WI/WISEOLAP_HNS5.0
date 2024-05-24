import {styled} from 'styled-components';
import SmallButtonImage from '../Image/SmallButtonImage';
import SmallButtonLabel from '../Label/SmallButtonLabel';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: ${(props) => props.width || '100px'};
  height: 84px;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  align-items: center;
  border: 1px solid ${theme.color.gray200};
  flex-direction: column;
  word-break: keep-all;
  cursor: pointer;
  padding: 10px 5px;
  margin-bottom: 8px;

  &:hover {
    background: #F6FAFF;
  }

  div {
    line-height: 12px;
  }

  img + div {
    margin-top: 5px;
  }

  ${(props) => props.active && `
    border: 1px solid #BCD1F0;
    background: #F6FAFF;
    color: #3679DA;
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
