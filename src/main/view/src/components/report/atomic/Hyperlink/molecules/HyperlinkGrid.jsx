import DataGrid, {Column, Editing, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const HyperlinkGrid = ({gridRef, ...props}) => {
  return (
    <DataGrid
      width={'100%'}
      height={'100%'}
      showBorders={true}
      allowColumnResizing={true}
      ref={gridRef}
      {...props}
    >
      <Editing
        mode="row"
        useIcons={true}
        confirmDelete={false}
        allowDeleting={true}
      />
      <Selection mode='single'/>
      <Column
        dataField='name'
        caption={localizedString.name}
      />
      <Column
        dataField='link'
        caption={'URL'}
      />
      <Column
        dataField='description'
        caption={localizedString.description}
      />
    </DataGrid>
  );
};

export default HyperlinkGrid;
