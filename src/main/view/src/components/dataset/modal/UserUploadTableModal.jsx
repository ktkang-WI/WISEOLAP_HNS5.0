import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import localizedString from 'config/localization';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection, Editing} from 'devextreme-react/data-grid';
import {CheckBox, TextBox} from 'devextreme-react';
import FileUploader from 'devextreme-react/file-uploader';
import {selectCurrentDatasets, selectDatasetQuantity}
  from 'redux/selector/DatasetSelector';
import models from 'models';

const theme = getTheme();

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const UserUploadTableModal = ({
  onClose, onSubmit, dsId, selectedTable, selectedDataSource, ...props
}) => {
  const [uploadData, setUploadData] = useState([]);
  const [dataNm, setDataNm] = useState('');
  const [deleteCheck, setDeleteCheck] = useState(true);
  const datasets = useSelector(selectCurrentDatasets);
  const datasetQuantity = useSelector(selectDatasetQuantity);

  const datasetId = 'dataset' + (datasetQuantity + 1);

  useEffect(() => {
    if (selectedTable.dataNm && selectedTable.dataNm != '') {
      setDataNm(selectedTable.dataNm);
    }
  }, []);

  const onDatasetNmChanged = (e) => {
    setDataNm(e);
  };

  const onDeleteAfterInsert = (e) => {
    setDeleteCheck(e);
  };

  const onUploaded = (e) => {
    const data = JSON.parse(e.request.responseText);
    setUploadData(data);
  };

  return (
    <Modal
      onSubmit={() => {
        const dupleCheck = datasets.find((ds) =>
          ds.datasetNm == dataNm && ds.datasetId != datasetId);

        if (!dataNm || dataNm == '') {
          alert(localizedString.emptyDatasetNmMsg);
        } else if (!uploadData || uploadData.length == 0) {
          alert(localizedString.emptyUploadDataMsg);
        } else if (dupleCheck) {
          alert(localizedString.duplicatedDatasetNameMsg);
        } else {
          let appendTable = '';
          if (selectedTable.tableNm && selectedTable.tableNm != '') {
            appendTable = selectedTable.tableNm;
            if (appendTable.indexOf('.') > -1 ) {
              appendTable = appendTable.split('.')[1];
            }
          }
          const tableDeleteYN = deleteCheck ? 'Y' : 'N';

          models.File.uploadUserData(dsId, dataNm, uploadData,
              appendTable, tableDeleteYN)
              .then(({data}) => {
                console.log(data);
                const tableName = data.tableName.indexOf('.') > -1 ?
                    data.tableName.split('.')[1] : data.tableName;

                const tableObject = {};
                tableObject.TBL_NM = tableName;
                tableObject.TBL_CAPTION = tableName;
                tableObject.datasetNm = dataNm;

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
                      onSubmit(tableObject, data);
                      onClose();
                    });
              }).catch(({data}) => {
                console.log(data);
              });
        }
        return true;
      }}
      modalTitle={localizedString.selectUploadFile}
      onClose={onClose}
      height={theme.size.bigModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <ModalPanel
        title={localizedString.datasetName}
        width='100%'
        height='14%'
        padding='10'>
        <RowWrapper>
          <TextBox
            width='400px'
            height='100%'
            value={dataNm}
            onValueChange={onDatasetNmChanged}
          />
          <CheckBox
            visible={dataNm != '' ? true : false}
            value={deleteCheck}
            onValueChange={onDeleteAfterInsert}
            text='데이터 삭제 후 추가'
          />
        </RowWrapper>
      </ModalPanel>
      <ModalPanel
        title={localizedString.selectUploadFile}
        width='100%'
        height='35%'
        padding='10'>
        <RowWrapper>
          <FileUploader
            multiple={false}
            accept={'.xls, .xlsx, .csv'}
            uploadMode='instantly'
            labelText={localizedString.selectUploadFile}
            selectButtonText={localizedString.selectFile}
            // uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
            uploadUrl={
              // window.location.host+'/editds
              '/upload/upload-data-column'
            }
            onUploaded={onUploaded}
          />
        </RowWrapper>
      </ModalPanel>
      <ModalPanel
        title={localizedString.columnType}
        width='100%'
        height='62%'
        padding='10'>
        <CommonDataGrid
          dataSource={uploadData}
          useFilter={false}
          onSelectionChanged={(e) => {
            console.log(e);
          }}
          onRowUpdated={(columns) => {
            const changeuploadData = uploadData.map((row) => {
              if (columns.key == row.colPhysicalNm) {
                row = columns.data;
              }
              return row;
            });
            setUploadData(changeuploadData);
          }}
        >
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={false}
            allowDeleting={false} />
          <Selection mode='single'/>
          <Column
            dataField='colPhysicalNm'
            caption={localizedString.columnPhysicalName}
            allowEditing={false}
          />
          <Column
            dataField='colNm'
            caption={localizedString.columnLogicalName}
            allowEditing={false}
          />
          <Column
            dataField='colType'
            caption={localizedString.dataType}
            allowEditing={true}
          />
          <Column
            dataField='colSize'
            caption={localizedString.length}
            allowEditing={true}
          />
        </CommonDataGrid>
      </ModalPanel>
    </Modal>
  );
};

export default UserUploadTableModal;
