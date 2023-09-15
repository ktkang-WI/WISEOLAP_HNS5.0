import TabPanel from 'devextreme-react/tab-panel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import React from 'react';

const theme = getTheme();

const StyledTabPanel = styled(TabPanel)`
  .dx-tab.dx-state-hover{
    background: ${theme.color.selectedTabHeader};
    border-bottom: 1px solid  ${theme.color.breakLine};
  }

  .dx-tab.dx-tab-selected {
    background: ${theme.color.secondaryGradient};
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

const PanelTitleText = styled.span`
  font: ${theme.font.panelTitle};
`;

const itemTitleRender = (data) => {
  return <PanelTitleText>{data.title}</PanelTitleText>;
};

const CommonTab = ({
  ...props
}) => {
  return (
    <StyledTabPanel
      width={theme.size.panelWidth}
      height='100%'
      focusStateEnabled={false}
      itemTitleRender={itemTitleRender}
      {...props}
    >
    </StyledTabPanel>
  );
};

export default React.memo(CommonTab);
