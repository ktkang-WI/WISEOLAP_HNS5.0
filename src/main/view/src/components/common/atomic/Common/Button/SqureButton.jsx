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
  margin: 5px;
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
`;

const SqureButton = ({icon, label, width='100%', height='100%'}) => {
  return (
    <Wrapper>
      <SmallButtonImage src={icon}></SmallButtonImage>
      <SmallButtonLabel>{label}</SmallButtonLabel>
    </Wrapper>
  );
};

export default SqureButton;
