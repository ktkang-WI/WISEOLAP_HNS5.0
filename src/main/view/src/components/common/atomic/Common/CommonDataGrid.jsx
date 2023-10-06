import {DataGrid} from 'devextreme-react';
import {FilterRow, Selection} from 'devextreme-react/data-grid';

const CommonDataGrid = ({useFilter = true, children, ...props}) => {
  return (
    <DataGrid
      showBorders={true}
      width={'100%'}
      height={'100%'}
      allowColumnResizing={true}
      {...props}
    >
      <FilterRow visible={useFilter} />
      <Selection mode={(props) => props.selectionMode || 'single'} />
      {children}
    </DataGrid>
  );
};

export default CommonDataGrid;
