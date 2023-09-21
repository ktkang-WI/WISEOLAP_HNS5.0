import Footer from '../molecules/Footer';
import Header from '../molecules/Header';
import Draggable from 'react-draggable';
// import {styled} from 'styled-components';
import Content from '../atoms/Content';
import Overlay from '../atoms/Overlay';
import Inner from '../atoms/Inner';
import {useState} from 'react';

const Modal = ({
  children,
  onClose,
  onSubmit,
  page=0,
  usePage=false,
  width='50%', height='50%',
  modalTitle='',
  ...props
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Overlay>
      <Draggable
        handle='.modal-header'
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
              setCurrentPage(currentPage - 1);
            }}
            onNext={() => {
              setCurrentPage(currentPage + 1);
            }}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        </Content>
      </Draggable>
    </Overlay>
  );
};

export default Modal;
