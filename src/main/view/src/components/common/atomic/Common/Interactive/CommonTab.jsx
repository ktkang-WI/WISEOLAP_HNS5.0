import TabPanel from 'devextreme-react/tab-panel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import React from 'react';

const theme = getTheme();

const StyledTabPanel = styled(TabPanel)`
  .dx-tab span{
    font: ${theme.font.tabTitle};
  }

  .dx-tab.dx-tab-selected {
    border-bottom: 3px solid ${theme.color.primary};
    span {
      color: ${theme.color.primary};
    }
  }

  .dx-tab.dx-tab-selected > div {
    top: -3.5px;
  }

  .dx-tab {
    background: none;
    border-bottom: 1px solid ${theme.color.breakLine};
    box-sizing: border-box;
    span {
      color: ${theme.color.primaryFont};
    }
  }

  .dx-tabs {
    background: none;
    box-shadow: none !important;
  }

  .dx-tab > div {
    position: relative;
    top: -4px;
  }

  .dx-tabs-wrapper {
    height: calc(${theme.size.tabHeaderHeight} - 10px);
  }

  .dx-tabpanel-tabs .dx-tab.dx-tab-selected {
    box-shadow: none !important;
  }

  .dx-tabpanel-tabs .dx-tab {
    width: ${(props) => props.tabWidth || 'auto'};
    padding: 0px 20px;
    box-shadow: none !important;
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
