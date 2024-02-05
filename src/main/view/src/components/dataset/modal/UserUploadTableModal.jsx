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

  return (
    <Modal
      onSubmit={() => {
        setUploadData([]);
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
            accept='*'
            uploadMode='instantly'
            labelText={localizedString.selectUploadFile}
            selectButtonText={localizedString.selectFile}
            uploadUrl="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload"
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
          onSelectionChanged={(e) => {
            console.log(e);
          }}
        >
          <Selection mode='single'/>
          <Column
            dataField='columNm'
            caption={localizedString.dataSourceName}
          />
          <Column
            dataField='columLogicalName'
            caption={localizedString.tableLogicalName}
          />
          <Column
            dataField='dataType'
            caption={localizedString.tableLogicalName}
          />
          <Column
            dataField='length'
            caption={localizedString.tableLogicalName}
          />
        </CommonDataGrid>
      </ModalPanel>
    </Modal>
  );
};

export default UserUploadTableModal;
