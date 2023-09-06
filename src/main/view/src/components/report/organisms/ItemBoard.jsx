import {styled} from 'styled-components';
// import ItemHeader from '../molecules/ItemHeader';
// import ItemWrapper from '../molecules/ItemWrapper';
import GridLayout from 'react-grid-layout';

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

const ItemBoard = () => {
  const initialLayouts = [
    {i: 'grid1', x: 0, y: 0, w: 11.6, h: 20.6}
  ];

  return (
    <StyledBoard>
      <GridLayout
        className="layout"
        layout={initialLayouts}
        cols={12} // Number of columns in the grid
        rowHeight={30} // Height of a single row in pixels
        width={1200} // Width of the grid in pixels
      >
        <SelectedBoard key="grid1">Grid 1</SelectedBoard>
      </GridLayout>
    </StyledBoard>
  );
};

export default ItemBoard;
