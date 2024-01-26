import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CreateRibbonBtns from '../molecules/CreateRibbonBtns';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';

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
  const designerMode = useSelector(selectCurrentDesignerMode);
  const focusedItem = useSelector(selectCurrentItem);

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
        targetItem={focusedItem}
        items={!focusedItem || designerMode === DesignerMode['EXCEL'] ?
         [] : focusedItem.mart.ribbonItems}
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
