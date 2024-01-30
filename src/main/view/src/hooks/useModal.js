import Alert from 'components/common/atomic/Modal/organisms/Alert';
import {useDispatch} from 'react-redux';
import ModalSlice from 'redux/modules/ModalSlice';

export default function useModal() {
  const modalActions = ModalSlice.actions;
  const dispatch = useDispatch();

  /**
   * 모달을 엽니다.
   * @param {*} Component 모달 컴포넌트
   * @param {*} props 모달 컴포넌트에 전달할 props
   */
  const openModal = (Component, props) => {
    dispatch(modalActions.open({Component, props}));
  };

  /**
   * 모달을 닫습니다.
   * @param {*} id 모달의 id
   */
  const closeModal = (id) => {
    dispatch(modalActions.close(id));
  };

  /**
   * 알림창을 엽니다.
   * @param {string} msg
   */
  const alert = (msg) => {
    openModal(Alert, {
      message: msg
    });
  };

  /**
   * 확인, 취소 버튼이 있는 알림창을 엽니다.
   * @param {string} msg
   * @param {funciton} onSubmit
   */
  const confirm = (msg, onSubmit) => {
    openModal(Alert, {
      type: 'confirm',
      message: msg,
      onSubmit
    });
  };

  /**
   * 경고창을 엽니다.
   * @param {string} msg
   */
  const warning = (msg) => {
    openModal(Alert, {
      type: 'warning',
      message: msg
    });
  };

  return {
    openModal,
    closeModal,
    alert,
    warning,
    confirm
  };
};
