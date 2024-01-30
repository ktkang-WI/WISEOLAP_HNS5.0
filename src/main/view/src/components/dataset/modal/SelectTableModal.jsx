import Modal from 'components/common/atomic/Modal/organisms/Modal';
import models from 'models';
import {useState, useEffect} from 'react';
import {getTheme} from 'config/theme';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const theme = getTheme();

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
        onSubmit(selectedTable);
      }}
      modalTitle={localizedString.tableList}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
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
