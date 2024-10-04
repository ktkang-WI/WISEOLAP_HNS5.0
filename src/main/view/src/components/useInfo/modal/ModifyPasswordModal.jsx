import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModifyPasswordForm from './ModifyPasswordForm';
import {useRef} from 'react';
import useModal from 'hooks/useModal';
import {updatePassword} from 'models/config/myPage/MyPageConfig';
import {getFrontValidations, getServerValidations} from './Validations';
import localizedString from 'config/localization';
import {selectOpenedModals} from 'redux/selector/ModalSelector';
import {useSelector} from 'react-redux';

const ModifyPasswordModal = ({...props}) => {
  const ref = useRef(null);
  const openedModals = useSelector(selectOpenedModals);

  const {alert, success, confirm, closeModal} = useModal();

  const onSubmit = async () => {
    if (!ref.current) return true;

    const formData = ref.current.instance.option().formData;

    // 통신 전 유효성 검사.
    const isPassObj = getFrontValidations(formData);

    if (isPassObj?.result) {
      if (isPassObj?.message !== '') {
        alert(isPassObj.message);
      }
      return true;
    }

    const result = await updatePassword(formData).then((res) => {
      if (res.status == 200) {
        const result = getServerValidations(res.data.invalidStatus);

        if (result.result == true && result.message !== '') {
          alert(result.message);
        } else if (result.result == false && result.message !== '') {
          success(result.message);
        }
        return result.result;
      } else {
        alert(localizedString.updateException);
      }
    }).catch((e) => {
      console.log(e);
    });
    return result;
  };

  return (
    <Modal
      modalTitle={localizedString.passwordChange}
      height='340px'
      width='500px'
      onSubmit={() => {
        confirm(localizedString.confirmModifyPw, async () => {
          let isSubmit = true;
          isSubmit = await onSubmit();

          // 강제 닫기 (업데이트 완료 일 경우)
          if (!isSubmit) {
            openedModals.map((modal, index) => {
              const {id} = modal;

              closeModal(id);
            });
          }
        });
        return true;
      }}
      {...props}
    >
      <ModifyPasswordForm
        ref={ref}
      />
    </Modal>
  );
};
export default ModifyPasswordModal;
