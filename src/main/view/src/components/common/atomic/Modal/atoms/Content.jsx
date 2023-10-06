import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const Content = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: absolute;
  top: calc(50% - (${(props) => props.height} / 2));
  left: calc(50% - (${(props) => props.width} / 2));
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.1) 2px 2px 5px 0px;
  background-color: white;
  justify-content: center;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
  border: 1px solid ${theme.color.breakLine};
`;

export default Content;
