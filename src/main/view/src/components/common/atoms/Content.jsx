import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const Content = styled.div`
  padding-left: ${theme.size.snbWidth};
  height: calc(100vh - ${theme.size.headerHeight});
  width: calc(100vw - ${theme.size.snbWidth});
`;

export default Content;
