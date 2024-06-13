import DataGrid, {Column, Editing, Selection} from 'devextreme-react/data-grid';
import variationValueType from './variationValueType.js';
import localizedString from 'config/localization';

const VariationValueGrid = ({gridRef, ...props}) => {
  const typeMapper = variationValueType.reduce((acc, type) => {
    acc[type.value] = type.caption;

    return acc;
  }, {});

  return (
    <DataGrid
      width={'100%'}
      height={'100%'}
      showBorders={true}
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
        dataField='id'
        visible={false}
      />
      <Column
        dataField='name'
        caption={localizedString.variationValueName}
      />
      <Column
        dataField='targetName'
        caption={localizedString.targetFieldName}
      />
      <Column
        dataField='type'
        caption={localizedString.type}
        calculateCellValue={(e) => {
          return typeMapper[e.type];
        }}
      />
    </DataGrid>
  );
};

export default VariationValueGrid;
