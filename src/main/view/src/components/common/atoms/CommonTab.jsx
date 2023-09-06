import TabPanel from 'devextreme-react/tab-panel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import React from 'react';

const theme = getTheme();

const StyledTabPanel = styled(TabPanel)`
  .dx-tab.dx-state-hover, .dx-tab.dx-tab-selected {
    background: ${theme.color.selectedTabHeader};
    span {
      color: ${theme.color.secondaryFont};
    }
  }
  .dx-tab {
    background: ${theme.color.secondaryGradient};
    span {
      color: ${theme.color.primaryFont};
    }
  }
  .dx-tabs-wrapper {
    height: ${theme.size.tabHeaderHeight};
  }

  .dx-tabpanel-tabs .dx-tab.dx-tab-selected {
    box-shadow: inset 0 1px ${theme.color.breakLine},
    inset -1px 0 ${theme.color.breakLine},
    inset 1px 0 ${theme.color.breakLine};
  }

  .dx-tabpanel-tabs .dx-tab {
    width: 500px;
    padding: 0px;
    box-shadow: inset 0 1px ${theme.color.breakLine},
    inset 0 -1px ${theme.color.breakLine} !important;
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
