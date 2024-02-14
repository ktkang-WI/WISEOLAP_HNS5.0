import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {useEffect, useState} from 'react';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import localizedString from 'config/localization';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import {TextBox} from 'devextreme-react';
import FileUploader from 'devextreme-react/file-uploader';

const theme = getTheme();

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const UserUploadTableModal = ({
  dsId, selectedTable, onSubmit, ...props
}) => {
  const [uploadData, setUploadData] = useState([]);
  const [dataNm, setDataNm] = useState();
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
              '/dataset/upload/upload-data-column'
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
        >
          <Selection mode='single'/>
          <Column
            dataField='colPhysicalNm'
            caption={localizedString.columnPhysicalName}
          />
          <Column
            dataField='colNm'
            caption={localizedString.columnLogicalName}
          />
          <Column
            dataField='colType'
            caption={localizedString.dataType}
            readOnly={false}
          />
          <Column
            dataField='colSize'
            caption={localizedString.length}
          />
        </CommonDataGrid>
      </ModalPanel>
    </Modal>
  );
};

export default UserUploadTableModal;
