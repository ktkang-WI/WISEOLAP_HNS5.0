import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CreateRibbonBtns from '../molecules/CreateRibbonBtns';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';

const theme = getTheme();

const StyledRibbon = styled.div`
  width: 100vw;
  height: ${theme.size.ribbonHeight};
  border-bottom: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  padding-left: ${theme.size.snbWidth};
`;

const Ribbon = () => {
  const focustedItem = useSelector(selectCurrentItem);

  return (
    <StyledRibbon>
      <CreateRibbonBtns
        items={[
          'NewReport',
          'Dataset',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport',
          'ConnectReport'
        ]}
      />
      <CreateRibbonBtns
        items={[
          'AddContainer',
          'AddChart',
          'AddPivotGrid',
          'AddGrid',
          'AddCustomChart'
        ]}
      />
      <CreateRibbonBtns
        targetItem={focustedItem}
        items={!focustedItem ? [] : focustedItem.mart.ribbonItems}
      />
      <CreateRibbonBtns
        items={[
          'QuerySearch'
        ]}
      />
    </StyledRibbon>
  );
};

export default Ribbon;
