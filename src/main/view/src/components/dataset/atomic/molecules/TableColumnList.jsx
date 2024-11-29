
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Editing} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const TableColumnList = ({compact=false, dataSource, ...props}) => {
  return (
    <CommonDataGrid
      id='singleTableColumnList'
      dataSource={_.cloneDeep(dataSource)}
      useFilter={false}
      {...props}
    >
      <Editing
        mode="cell"
        allowUpdating={true}
        allowAdding={false}
        allowDeleting={false} />
      <Column
        caption={localizedString.columnPhysicalName}
        dataField='COL_NM'
        allowEditing={false}
      />
      <Column
        caption={localizedString.columnLogicalName}
        dataField='COL_CAPTION'
      />
      <Column
        caption={localizedString.dataType}
        dataField='DATA_TYPE'
        visible={!compact}
        allowEditing={false}
      />
      <Column
        caption={localizedString.visibility}
        dataField='visibility'
        dataType='boolean'
        allowEditing={true}
      />
      <Column
        caption={localizedString.order}
        dataField='order'
        visible={!compact}
        allowEditing={true}
      />
    </CommonDataGrid>
  );
};

export default TableColumnList;
