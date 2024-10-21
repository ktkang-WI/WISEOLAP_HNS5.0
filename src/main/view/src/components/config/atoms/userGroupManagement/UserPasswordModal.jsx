import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Form} from 'devextreme-react';
import {CompareRule, Item, Label, RequiredRule}
  from 'devextreme-react/form';
import useModal from 'hooks/useModal';
import {useRef} from 'react';
import {getTheme} from 'config/theme';
// eslint-disable-next-line max-len
import {checkAppliedSpace, preventInputSpaceBar} from 'components/useInfo/modal/Validations';

const theme = getTheme();

const UserPasswordModal = ({...props}) => {
  const {alert, success} = useModal();
  const user = props.user;
  const ref = useRef();

  const onClick = async () => {
    const formInstance = ref.current._instance;
    let isClose = true;
    const newPassword = formInstance.getEditor('newPassword')
        .option('value');
    const checkPassword = formInstance.getEditor('passwordConfirm')
        .option('value');
    user.passwd = newPassword;
    if (checkAppliedSpace(newPassword)) {
      alert('새 비밀번호 입력창에 공백이 포함되었습니다. 다시 입력해 주세요.');
      return true;
    }
    if (checkAppliedSpace(checkPassword)) {
      alert('비밀번호 확인 입력창에 공백이 포함되었습니다. 다시 입력해 주세요.');
      return true;
    }

    if (newPassword !== checkPassword) {
      alert('입력한 비밀번호가 같지 않습니다. 다시 확인해 주세요.');
      return true;
    }

    await user.updateUserPassword(user).then((res) => {
      if (res.status !== 200) {
        alert(localizedString.failedPasswordChange);
      } else {
        success('사용자 아이디 : ' + user.userId + ' 의 비밀번호 변경이 완료 되었습니다.' +
          '\n비밀번호가 초기화 된 사용자는 로그인 시 비밀번호를 변경해야 합니다.'
        );
        isClose = false;
      }
    }).catch((e) => {
      console.log(e);
    });
    return isClose;
  };

  const editorOptions = {
    mode: 'password',
    onKeyDown: preventInputSpaceBar
  };

  return (
    <Modal
      modalTitle={'비밀번호 초기화'}
      height={'300px'}
      width={theme.size.smallModalWidth}
      // confirm으로 확인.
      onSubmit={onClick}
      {...props}
    >
      <Form
        ref={ref}
      >
        <Item
          editorType='dxTextBox'
          dataField='newPassword'
          editorOptions={editorOptions}
        >
          <RequiredRule message={localizedString.validationPassword}/>
          <Label>
            {localizedString.newPassword}
          </Label>
        </Item>
        <Item
          editorType='dxTextBox'
          dataField='passwordConfirm'
          editorOptions={editorOptions}
        >
          <RequiredRule message={localizedString.validationPassword}/>
          <CompareRule
            message={localizedString.pwInconsistency}
            comparisonTarget={() => {
              const formInstance = ref.current._instance;
              const newPassword = formInstance.getEditor('newPassword')
                  .option('value');
              return newPassword;
            }}
          />
          <Label>
            {localizedString.passwordConfirm}
          </Label>
        </Item>
      </Form>
    </Modal>
  );
};

export default UserPasswordModal;
