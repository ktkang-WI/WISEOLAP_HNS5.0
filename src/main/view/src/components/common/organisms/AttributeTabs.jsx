import TabPanel from 'devextreme-react/tab-panel';
import ItemAttributeTab from './ItemAttributeTab';
import DataColumntab from './DataColumnTab';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import localizedString from '../../../config/localization';

const theme = getTheme();

const AttributeTabsSource = [
  {
    id: 'field',
    title: localizedString.field
  },
  {
    id: 'attribute',
    title: localizedString.attribute
  }
];

const getTabContent = ({data}) => {
  if (data.id === 'attribute') {
    return (
      <ItemAttributeTab/>
    );
  } else if (data.id === 'field') {
    return (
      <DataColumntab/>
    );
  }
};

const PanelTitleText = styled.span`
  font: ${theme.font.panelTitle};
`;

const itemTitleRender = (data) => {
  return <PanelTitleText>{data.title}</PanelTitleText>;
};

const StyledTabPanel = styled(TabPanel)`
  .dx-tab.dx-state-hover{
    background: ${theme.color.selectedTabHeader};
    border-bottom: 1px solid  ${theme.color.breakLine};
  }

  .dx-tab.dx-tab-selected {
    border-bottom: 3px solid ${theme.color.primary};
  }

  .dx-tab.dx-tab-selected > div {
    top: 2px;
  }

  .dx-tab {
    background: ${theme.color.secondaryGradient};
    border-bottom: 1px solid ${theme.color.breakLine};
    box-sizing: border-box;
    span {
      color: ${theme.color.primaryFont};
    }
  }

  .dx-tab > div {
    position: relative;
    top: 1px;
  }
  .dx-tabs-wrapper {
    height: ${theme.size.tabHeaderHeight};
  }

  .dx-tabpanel-tabs .dx-tab.dx-tab-selected {
    box-shadow: none !important;
  }

  .dx-tabpanel-tabs .dx-tab {
    width: 500px;
    padding: 0px;
    box-shadow: none !important;
    border-right: 1px solid ${theme.color.breakLine};
  }

  .dx-multiview-wrapper {
    border: none !important;
  }
`;

const AttributeTabs = () => {
  return (
    <StyledTabPanel
      dataSource={AttributeTabsSource}
      width={theme.size.panelWidth}
      height='100%'
      focusStateEnabled={false}
      itemComponent={getTabContent}
      itemTitleRender={itemTitleRender}
    >
    </StyledTabPanel>
  );
};

export default AttributeTabs;
