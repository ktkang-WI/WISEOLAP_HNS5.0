import {DataGrid} from 'devextreme-react';

const CommonDataGrid = ({children, ...props}) => {
  return (
    <DataGrid
      showBorders={true}
      width={'100%'}
      height={'100%'}
      {...props}
    >
      {children}
    </DataGrid>
  );
};

export default CommonDataGrid;
