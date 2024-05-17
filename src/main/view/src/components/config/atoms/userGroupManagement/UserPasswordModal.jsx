import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Form} from 'devextreme-react';
import {AsyncRule, Item, Label, RequiredRule, SimpleItem}
  from 'devextreme-react/form';
import useModal from 'hooks/useModal';
import {useRef} from 'react';
import {getTheme} from 'config/theme';
import models from 'models';

const theme = getTheme();

const UserPasswordModal = ({...props}) => {
  const {alert} = useModal();
  const user = props.user;
  const ref = useRef();

  const onClick = async () => {
    const formInstance = ref.current._instance;
    const validate = formInstance.validate();
    let isClose = true;

    const curPassword =
      formInstance.getEditor('currentPassword').option('value');

    const res = await models.Login.checkPassword(user.userId, curPassword);

    if (res.status != 200) {
      alert(localizedString.checkPasword);
      return true;
    }

    await validate.complete?.then(async (res) => {
      if (res.isValid) {
        const newPassword = formInstance.getEditor('newPassword')
            .option('value');

        user.passwd = newPassword;

        await user.updateUserPassword(user).then((res) => {
          if (res.status !== 200) {
            alert(localizedString.failedPasswordChange);
          } else {
            alert(localizedString.completedPasswordChange);
            isClose = false;
          }
        });
      }
    });
    return isClose;
  };

  const editorOptions = {
    mode: 'password'
  };

  const passwordValidation = (params) => {
    const passwd = ref.current._instance.getEditor('newPassword')
        .option('value');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(params.value === passwd);
      }, 500);
    });
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
        <SimpleItem
          editorType='dxTextBox'
          dataField='currentPassword'
          editorOptions={editorOptions}
        >
          <RequiredRule message={localizedString.validationPassword}/>
          <Label>
            {localizedString.currentPassword}
          </Label>
        </SimpleItem>
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
          <AsyncRule
            message={localizedString.checkPasword}
            validationCallback={passwordValidation}
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
