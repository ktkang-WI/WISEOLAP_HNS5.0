import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CreateRibbonBtns from '../molecules/CreateRibbonBtns';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';

const theme = getTheme();

const StyledRibbon = styled.div`
  width: calc(100% - ${theme.size.snbWidth} - 20px);
  border-radius: 10px;
  height: ${theme.size.ribbonHeight};
  border: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  margin-left: calc(${theme.size.snbWidth} + 10px);
  overflow: hidden;
  white-space: nowrap;
`;

const Ribbon = () => {
  const designerMode = useSelector(selectCurrentDesignerMode);
  const focusedItem = useSelector(selectCurrentItem);

  return (
    <StyledRibbon className='section'>
      <CreateRibbonBtns
        items={[
          'NewReport',
          'Dataset',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'ConnectReport',
          'DownloadReport'
        ]}
      />
      <CreateRibbonBtns
        items={
          designerMode === DesignerMode['AD_HOC'] ?
          ['AdHocLayout'] : [
            'AddContainer',
            'TabHeaderEnabled',
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
