import {getTheme} from 'config/theme';
import styled from 'styled-components';

const theme = getTheme();

const TitlePanel = styled.div`
  padding: 0px 0px 5px 10px;
  background-color: ${theme.color.background};
  background-image: ${theme.color.popoverTitleBackground};
  border-radius: 5px;
`;

const PopoverTitlePanel = ({children}) => {
  return (
    <TitlePanel>
      {children}
    </TitlePanel>
  );
};
export default PopoverTitlePanel;
