import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import models from 'models';
import {useState, useEffect} from 'react';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const theme = getTheme();

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & + & {
    border-left: 1px solid ${theme.color.breakLine};
  }
`;
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const SelectUserUploadTableModal = ({
  dsId, selectedDataSource, onSubmit, ...props
}) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState({});

  useEffect(() => {
    models.DBInfo.dbUploadTables(dsId)
        .then(({data}) => {
          setTables(data);
        }).catch((e) => {
          console.log(e);
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
      <RowWrapper>
        <ColumnWrapper>
          <ModalPanel
            title={localizedString.dataSourceInfo}
            width='300px'
            height='250px'
            padding='10'>
            <DataSourceInfoForm
              compact={true}
              selectedDataSource={selectedDataSource}
            />
          </ModalPanel>
        </ColumnWrapper>
        <ColumnWrapper>
          <CommonDataGrid
            dataSource={tables}
            onRowClick={(e) => {
              console.log(e);
              if (selectedTable != {}) {
                if (selectedTable == e.key) {
                  if (e.component) {
                    e.component.clearSelection();
                  }
                  setSelectedTable({});
                } else {
                  setSelectedTable(e.key);
                }
              } else {
                setSelectedTable(e.key);
              }
            }}
          >
            <Selection
              mode='single'
            />
            <Column
              dataField='dataNm'
              caption={localizedString.dataSourceName}
            />
            <Column
              dataField='tableNm'
              caption={localizedString.tableLogicalName}
            />
          </CommonDataGrid>
        </ColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default SelectUserUploadTableModal;
