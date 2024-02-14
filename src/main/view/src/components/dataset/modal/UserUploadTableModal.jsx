import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import localizedString from 'config/localization';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection, Editing} from 'devextreme-react/data-grid';
import {TextBox} from 'devextreme-react';
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
  dsId, selectedTable, ...props
}) => {
  const [uploadData, setUploadData] = useState([]);
  const [dataNm, setDataNm] = useState();

  const datasets = useSelector(selectCurrentDatasets);
  const datasetQuantity = useSelector(selectDatasetQuantity);

  const datasetId = 'dataset' + (datasetQuantity + 1);

  useEffect(() => {
  }, []);

  const onDatasetNmChanged = (e) => {
    setDataNm(e);
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
          models.File.uploadUserData(dsId, dataNm, uploadData)
              .then(({data}) => {
                console.log(data);
                onClose();
              });
        }
        return true;
      }}
      modalTitle={localizedString.selectUploadFile}
      height={theme.size.bigModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <ModalPanel
        title={localizedString.datasetName}
        width='100%'
        height='13%'
        padding='10'>
        <RowWrapper>
          <TextBox
            width='400px'
            value={dataNm}
            onValueChange={onDatasetNmChanged}
          />
        </RowWrapper>
      </ModalPanel>
      <ModalPanel
        title={localizedString.selectUploadFile}
        width='100%'
        height='22%'
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
        height='65%'
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
