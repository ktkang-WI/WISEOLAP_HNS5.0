import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Form} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import useModal from 'hooks/useModal';
import {useRef} from 'react';
import {getTheme} from 'config/theme';

const theme = getTheme();

const UserPasswordModal = ({...props}) => {
  const {alert} = useModal();
  const user = props.user;
  const ref = useRef();

  const validationCheck = () => {
    const formInstance = ref.current._instance;
    const newPassword = formInstance.getEditor('newPassword').option('value');
    const confirmPassword =
      formInstance.getEditor('passwordConfirm').option('value');

    return newPassword === confirmPassword;
  };

  const onClick =() => {
    const formInstance = ref.current._instance;
    const currentPassword =
      formInstance.getEditor('currentPassword').option('value');
    const newPassword = formInstance.getEditor('newPassword').option('value');

    if (!validationCheck()) {
      alert(localizedString.checkPasword);
      return true;
    }

    const param = {};

    param.userNo = user.userNo;
    param.currentPassword = currentPassword;
    param.newPassword = newPassword;
    user.passwd = newPassword;

    user.updateUserPassword(user).then((res) => {
      if (res.status !== 200) {
        alert(localizedString.failedPasswordChange);
      } else {
        alert(localizedString.completedPasswordChange);
      }
    });
  };

  const editorOptions = {
    mode: 'password'
  };

  return (
    <Modal
      modalTitle={localizedString.passwordChange}
      height={theme.size.smallModalHeight}
      width={theme.size.smallModalWidth}
      onSubmit={onClick}
      {...props}
    >
      <Form
        ref={ref}
      >
        <Item
          editorType='dxTextBox'
          dataField='currentPassword'
          editorOptions={editorOptions}
        >
          <Label>
            {localizedString.currentPassword}
          </Label>
        </Item>
        <Item
          editorType='dxTextBox'
          dataField='newPassword'
          editorOptions={editorOptions}
        >
          <Label>
            {localizedString.newPassword}
          </Label>
        </Item>
        <Item
          editorType='dxTextBox'
          dataField='passwordConfirm'
          editorOptions={editorOptions}
        >
          <Label>
            {localizedString.passwordConfirm}
          </Label>
        </Item>
      </Form>
    </Modal>
  );
};

export default UserPasswordModal;
