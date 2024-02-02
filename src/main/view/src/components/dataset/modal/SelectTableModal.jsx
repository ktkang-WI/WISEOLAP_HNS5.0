import Modal from 'components/common/atomic/Modal/organisms/Modal';
import models from 'models';
import {useState, useEffect} from 'react';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const SelectTableModal = ({dsId, onSubmit, ...props}) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    models.DBInfo.dbTables(dsId)
        .then(({data}) => {
          setTables(data);
        });
  }, []);

  return (
    <Modal
      onSubmit={() => {
        const tableName = selectedTable.TBL_NM;
        models.DBInfo.dbColumns(dsId, tableName)
            .then(({data}) => {
              data = data.map((column, i) => {
                if (column.COL_CAPTION == '') {
                  column.COL_CAPTION = column.COL_NM;
                }

                if (column.DATA_TYPE.toLowerCase() == 'int' ||
                    column.DATA_TYPE.toLowerCase() == 'decimal' ||
                    column.DATA_TYPE.toLowerCase() == 'bigint' ||
                    column.DATA_TYPE.toLowerCase() == 'number' ||
                    column.DATA_TYPE.toLowerCase() == 'float' ||
                    column.DATA_TYPE.toLowerCase() == 'double' ||
                    column.DATA_TYPE.toLowerCase() == 'numeric') {
                  column.TYPE = 'MEA';
                  column.columnTypeName = 'decimal';
                  column.columnName = column.COL_NM;
                } else {
                  column.TYPE = 'DIM';
                  column.columnTypeName = 'varchar2';
                  column.columnName = column.COL_NM;
                }

                column.order = i;
                column.visibility = true;
                return column;
              });
              onSubmit(selectedTable, data);
            });
      }}
      modalTitle={localizedString.tableList}
      {...props}
    >
      <CommonDataGrid
        dataSource={tables}
        onSelectionChanged={(e) => {
          console.log(e);
          if (e.selectedRowsData.length > 0) {
            setSelectedTable(e.selectedRowsData[0]);
          } else {
            setSelectedTable({});
          }
        }}
      >
        <Selection mode='single'/>
        <Column
          dataField='TBL_NM'
          caption={localizedString.tablePhysicalName}
        />
        <Column
          dataField='TBL_CAPTION'
          caption={localizedString.tableLogicalName}
        />
      </CommonDataGrid>
    </Modal>
  );
};

export default SelectTableModal;
