import {selectOpenedModals} from 'redux/selector/ModalSelector';
import {useSelector} from 'react-redux';
import useModal from 'hooks/useModal';
import {AnimatePresence} from 'framer-motion';

const Modals = () => {
  const {closeModal} = useModal();
  const openedModals = useSelector(selectOpenedModals);

  return (
    <AnimatePresence>
      {openedModals.map((modal, index) => {
        const {id, Component, props} = modal;

        const onClose = () => {
          closeModal(id);
        };

        return <Component key={index} onClose={onClose} {...props} />;
      })}
    </AnimatePresence>
  );
};

export default Modals;
