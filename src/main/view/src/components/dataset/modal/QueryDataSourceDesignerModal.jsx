import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';

const QueryDataSourceDesignerModal = ({onSubmit, ...props}) => {
  return (
    <Modal
      onSubmit={() => {

      }}
      width='70%'
      height='90%'
      modalTitle='데이터 집합 디자이너'
      {...props}
    >
      데이터 집합 디자이너
      <QueryEditor/>
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
