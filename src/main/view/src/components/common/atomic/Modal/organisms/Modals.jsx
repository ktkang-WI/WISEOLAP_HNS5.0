import {selectOpenedModals} from 'redux/selector/ModalSelector';
import {useSelector} from 'react-redux';
import useModal from 'hooks/useModal';

const Modals = () => {
  const {closeModal} = useModal();
  const openedModals = useSelector(selectOpenedModals);

  return openedModals.map((modal, index) => {
    const {Component, props} = modal;

    const onClose = () => {
      closeModal(index);
    };

    return <Component key={index} onClose={onClose} {...props} />;
  });
};

export default Modals;
