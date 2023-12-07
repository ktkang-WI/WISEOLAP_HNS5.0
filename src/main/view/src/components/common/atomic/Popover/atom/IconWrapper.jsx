import {getTheme} from 'config/theme';
import styled from 'styled-components';

const theme = getTheme();

const Wrap = styled.div`
  border: 2px solid ${theme.color.background};
  & > div: hover {
    background-color: ${theme.color.background}
  }
  margin: 5px 0px 10px 10px;
`;

const IconWrapper = ({children}) => {
  return (
    <Wrap>
      {children}
    </Wrap>
  );
};
export default IconWrapper;
