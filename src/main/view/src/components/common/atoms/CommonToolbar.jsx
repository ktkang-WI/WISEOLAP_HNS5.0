import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import Toolbar, {Item} from 'devextreme-react/toolbar';

const theme = getTheme();

const StyledTabPanel = styled(Toolbar)`
  .dx-toolbar-items-container {
    height: ${theme.size.filterBarHeight};
    background: ${theme.color.filterBar};
  }
`;

const CommonToolbar = ({items}) => {
  return (
    <StyledTabPanel
      height={theme.size.filterBarHeight}
    >
      {
        items.map((item, index) => {
          return (
            <Item
              key={index}
              location={item.location}
              widget={item.widget}
              options={item.options}
            />
          );
        })
      }
    </StyledTabPanel>
  );
};

export default CommonToolbar;
