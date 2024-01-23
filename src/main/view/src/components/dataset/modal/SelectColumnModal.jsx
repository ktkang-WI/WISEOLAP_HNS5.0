import Modal from 'components/common/atomic/Modal/organisms/Modal';
import models from 'models';
import {useState, useEffect} from 'react';
import {getTheme} from 'config/theme';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const theme = getTheme();

const SelectColumnModal = ({dsId, table, onSubmit, ...props}) => {
  const [columns, setColumns] = useState([]);
  let selectedColumn = {};

  useEffect(() => {
    // TODO: 추후 접속중인 유저 ID로 변경
    models.DBInfo.dbColumns(dsId, table)
        .then(({data}) => {
          setColumns(data);
        });
  }, []);

  return (
    <Modal
      onSubmit={() => {
        onSubmit(selectedColumn);
      }}
      modalTitle={localizedString.tableList}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <CommonDataGrid
        dataSource={columns}
        onSelectionChanged={(e) => {
          if (e.selectedRowsData.length > 0) {
            selectedColumn = e.selectedRowsData[0];
          } else {
            selectedColumn = {};
          }
        }}
      >
        <Selection mode='single'/>
        <Column
          dataField='COL_NM'
          caption={localizedString.columnPhysicalName}
        />
        <Column
          dataField='COL_CAPTION'
          caption={localizedString.columnLogicalName}
        />
      </CommonDataGrid>
    </Modal>
  );
};

export default SelectColumnModal;
