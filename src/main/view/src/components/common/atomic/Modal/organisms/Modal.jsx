import Footer from '../molecules/Footer';
import Header from '../molecules/Header';
import Draggable from 'react-draggable';
import Content from '../atoms/Content';
import Overlay from '../atoms/Overlay';
import Inner from '../atoms/Inner';
import {useState} from 'react';
import {motion} from 'framer-motion';
import Wrapper from '../../Common/Wrap/Wrapper';

const Modal = ({
  children,
  onClose,
  onSubmit,
  onChangedPage,
  page=0,
  usePage=false,
  width='50%', height='50%',
  modalTitle='',
  onDelete,
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const changePage = (nextPage) => {
    if (onChangedPage) {
      onChangedPage(nextPage);
    }
    setCurrentPage(nextPage);
  };

  return (
    <motion.div
      initial={{opacity: 0, zIndex: 30}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      style={{position: 'fixed'}}
    >
      <Overlay>
        <Draggable
          handle='.modal-header'
        >
          <Wrapper>
            <motion.div
              style={{width: '100%', height: '100%'}}
              initial={{scale: 0.7}}
              animate={{scale: 1}}
              exit={{scale: 0.7}}
              transition={{duration: 0.2}}
            >
              <Content width={width} height={height}>
                <Header>
                  {modalTitle}
                </Header>
                <Inner usePage={usePage} currentPage={currentPage}>
                  {children}
                </Inner>
                <Footer
                  currentPage={currentPage}
                  maxPage={page}
                  usePage={usePage}
                  onPrev={() => {
                    changePage(currentPage - 1);
                  }}
                  onNext={() => {
                    changePage(currentPage + 1);
                  }}
                  onDelete={onDelete}
                  onSubmit={onSubmit}
                  onClose={onClose}
                />
              </Content>
            </motion.div>
          </Wrapper>
        </Draggable>
      </Overlay>
    </motion.div>
  );
};

export default Modal;
