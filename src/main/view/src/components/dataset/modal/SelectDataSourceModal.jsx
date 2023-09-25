import Modal from 'components/common/atomic/Modal/organisms/Modal';

const SelectDataSourceModal = ({onSubmit, ...props}) => {
  return (
    <Modal
      onSubmit={()=> {
        onSubmit({});
      }}
      width='70%'
      height='90%'
      modalTitle='데이터 원본 선택'
      {...props}
    >
      데이터 원본 선택
    </Modal>
  );
};

export default SelectDataSourceModal;
