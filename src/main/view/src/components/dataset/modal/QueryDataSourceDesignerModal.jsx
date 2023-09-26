import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import {TreeView} from 'devextreme-react';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column} from 'devextreme-react/data-grid';

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, ...props
}) => {
  return (
    <Modal
      onSubmit={() => {

      }}
      width='70%'
      height='90%'
      modalTitle='데이터 집합 디자이너'
      {...props}
    >
      <DataSourceInfoForm
        compact={true}
        selectedDataSource={selectedDataSource}
      />
      <QueryEditor/>
      <TreeView></TreeView>
      <CommonDataGrid>
        <Column caption='매개변수 명'/>
        <Column caption='매개변수 Caption'/>
        <Column caption='데이터 유형'/>
        <Column caption='매개변수 유형'/>
        <Column caption='Visible'/>
        <Column caption='다중선택'/>
        <Column caption='순서'/>
        <Column caption='조건 명'/>
      </CommonDataGrid>
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
