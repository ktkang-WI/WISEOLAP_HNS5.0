import Modal from 'components/common/atomic/Modal/organisms/Modal';
import models from 'models';
import {useState, useEffect} from 'react';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const SelectTableModal = ({dsId, dsViewId, onSubmit, ...props}) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    if (dsViewId) {
      models.DBInfo.dsViewdbTables(dsId, dsViewId)
          .then(({data}) => {
            setTables(data);
          }).catch((e) => {
            console.log(e);
          });
    } else {
      models.DBInfo.dbTables(dsId)
          .then(({data}) => {
            setTables(data);
          }).catch((e) => {
            console.log(e);
          });
    }
  }, []);

  return (
    <Modal
      onSubmit={() => {
        if (_.isEmpty(selectedTable)) {
          alert(localizedString.validationTableSelect);
          return true;
        }
        const tableName = dsViewId ?
            selectedTable.tableNm : selectedTable.TBL_NM;
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
                  column.columnName = column.COL_CAPTION;
                } else {
                  column.TYPE = 'DIM';
                  column.columnTypeName = 'varchar2';
                  column.columnName = column.COL_CAPTION;
                }

                column.order = i;
                column.visibility = true;
                return column;
              });
              onSubmit(selectedTable, data);
            }).catch((e) => {
              console.log(e);
            });
      }}
      modalTitle={localizedString.tableList}
      {...props}
    >
      <CommonDataGrid
        dataSource={tables}
        onSelectionChanged={(e) => {
          if (e.selectedRowsData.length > 0) {
            const tempTable = e.selectedRowsData[0];
            if (dsViewId) {
              tempTable.TBL_NM = tempTable.tableNm;
              tempTable.TBL_CAPTION = tempTable.tableCaption;
            }
            setSelectedTable(tempTable);
          } else {
            setSelectedTable({});
          }
        }}
      >
        <Selection mode='single'/>
        <Column
          dataField={dsViewId ? 'tableNm' : 'TBL_NM'}
          caption={localizedString.tablePhysicalName}
        />
        <Column
          dataField={dsViewId ? 'tableCaption' : 'TBL_CAPTION'}
          caption={localizedString.tableLogicalName}
        />
      </CommonDataGrid>
    </Modal>
  );
};

export default SelectTableModal;
