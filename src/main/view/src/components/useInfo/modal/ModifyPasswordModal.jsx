import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModifyPasswordForm from './ModifyPasswordForm';
import {useRef} from 'react';
import useModal from 'hooks/useModal';
import {updatePassword} from 'models/config/myPage/MyPageConfig';
import {getFrontValidations, getServerValidations} from './Validations';
import localizedString from 'config/localization';
import {selectOpenedModals} from 'redux/selector/ModalSelector';
import {useSelector} from 'react-redux';

const ModifyPasswordModal = ({msg = '', type = 1, ...props}) => {
  const ref = useRef(null);
  const openedModals = useSelector(selectOpenedModals);

  const {alert, success, confirm, closeModal} = useModal();

  // ---- TODO : 추후 백단에서 DATE 설정. 요청있을시 사용예정 ----
  // const getToDay = () => {
  //   const today = new Date();
  //   const year = today.getFullYear();
  //   const month = ('0' + (today.getMonth() + 1)).slice(-2);
  //   const day = ('0' + today.getDate()).slice(-2);

  //   const dateString = year + '-' + month + '-' + day;

  //   const hours = ('0' + today.getHours()).slice(-2);
  //   const minutes = ('0' + today.getMinutes()).slice(-2);
  //   const seconds = ('0' + today.getSeconds()).slice(-2);

  //   const timeString = hours + ':' + minutes + ':' + seconds;

  //   return dateString + ' ' + timeString;
  // };

  const buttons = [
    // {
    //   text: '연장',
    //   onClick: () => {
    //     const toDay = getToDay();
    //     // 3개월 연장 TEST
    //     // pwChangeDt -> 오늘 날짜로 변경.
    //     const result = addPwChangeDt({pwChangeDt: toDay}).then((res) => {
    //       if (res.status !== 200) {
    //         alert('변경에 실패 했습니다. 관리자에게 문의해 주세요');
    //         return true;
    //       }
    //       success('3개월 연장 되었습니다. 변경을 원하시면 마이페이지에서 변경 가능합니다.');
    //       return false;
    //     }).catch((e) => {
    //       alert('변경에 실패 했습니다. 관리자에게 문의해 주세요.');
    //       console.log(e);
    //       return false;
    //     });
    //     return result;
    //   }
    // },
    {
      text: '취소',
      type: 'secondary',
      onClick: () => {
      }
    }
  ];

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
      height='auto'
      width='550px'
      changeCancel={type == 1 ? false : true}
      buttons={type == 1 ? [] : buttons}
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
      onClose={() => {
        openedModals.map((modal, index) => {
          const {id} = modal;

          closeModal(id);
        });
      }}
      {...props}
    >
      <ModifyPasswordForm
        ref={ref}
      />
      {msg && <div style={{padding: '10px', color: '#FE0000'}}>{msg}</div>}
    </Modal>
  );
};
export default ModifyPasswordModal;
