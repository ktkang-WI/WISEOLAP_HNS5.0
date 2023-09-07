import {styled} from 'styled-components';
import ChartExample from './ChartExample';
import FlexLayout from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
// import * as FlexLayout from "flexlayout-react";

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
`;

// const SelectedBoard = styled.div`
//   height: inherit; /* Inherit height from parent */
//   width: inherit; /* Inherit width from parent */
//   background: white;
// `;

const ItemBoard = () => {
  const initialLayouts = [
    {i: 'grid1', x: 0, y: 0, w: 1000, h: 1000},
    {i: 'grid2', x: 6, y: 0, w: 1000, h: 1000}
  ];

  return (
    <StyledBoard>
      <FlexLayout.Layout
        model={{global: {tabEnableClose: true}}}
        layout={initialLayouts}
      >
        <FlexLayout.TabSet key="grid1">
          <FlexLayout.Tab name="ChartExample 1">
            <ChartExample />
          </FlexLayout.Tab>
        </FlexLayout.TabSet>
        <FlexLayout.TabSet key="grid2">
          <FlexLayout.Tab name="ChartExample 2">
            <ChartExample />
          </FlexLayout.Tab>
        </FlexLayout.TabSet>
      </FlexLayout.Layout>
    </StyledBoard>
  );
};

export default ItemBoard;
