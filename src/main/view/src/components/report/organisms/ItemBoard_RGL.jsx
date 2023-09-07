import {styled} from 'styled-components';
import ChartExample from './ChartExample';
import {Responsive} from 'react-grid-layout';
import {WidthProvider as widthProvider} from 'react-grid-layout';
const ResponsiveGridLayout = widthProvider(Responsive);

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
`;

const SelectedBoard = styled.div`
  height: inherit; /* Inherit height from parent */
  width: inherit; /* Inherit width from parent */
  background: white;
`;

const ItemBoard_RGL = () => {
  // const maxWidth = 12;
  // const maxHeight = 21;
  // const width = Math.min(maxWidth, 11.6);
  // const height = Math.min(maxHeight, 20.6);

  const initialLayouts = [
    {i: 'grid1', x: 0, y: 0, w: 1000, h: 1000},
    {i: 'grid2', x: 6, y: 0, w: 1000, h: 1000}
  ];
  //  width={1200}
  return (
    <StyledBoard>
      <ResponsiveGridLayout
        className="layout"
        layout={initialLayouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 12, sm: 12, xs: 4, xxs: 2}}
        rowHeight={30} // Height of a single row in pixels
      >
        <SelectedBoard key="grid1">
          <ChartExample/>
        </SelectedBoard>
        <SelectedBoard key="grid2">
          <ChartExample/>
        </SelectedBoard>
      </ResponsiveGridLayout>
    </StyledBoard>
  );
};

export default ItemBoard_RGL;
