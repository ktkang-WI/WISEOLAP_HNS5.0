import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from './SelectDataSourceModal/DataSourceInfoForm';

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, ...props
}) => {
  console.log(selectedDataSource);
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
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
