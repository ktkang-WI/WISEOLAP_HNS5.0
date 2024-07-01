import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModifyPasswordForm from './ModifyPasswordForm';
import {useRef} from 'react';
import useModal from 'hooks/useModal';
import {updatePassword} from 'models/config/myPage/MyPageConfig';
import {getFrontValidations, getServerValidations} from './Validations';
import localizedString from 'config/localization';

const ModifyPasswordModal = ({...props}) => {
  const ref = useRef(null);
  const {alert, success, confirm} = useModal();

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
    });
    return result;
  };

  return (
    <Modal
      modalTitle={localizedString.passwordChange}
      height='340px'
      width='500px'
      onSubmit={() => {
        let isSubmit = true;
        confirm(localizedString.confirmModifyPw, async () => {
          isSubmit = await onSubmit();
          return false;
        });
        // 변경 완료해도 팝업 안닫힘...
        return isSubmit;
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
