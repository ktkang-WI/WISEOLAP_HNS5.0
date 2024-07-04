import ModifyPasswordModal from 'components/useInfo/modal/ModifyPasswordModal';
import {preventInputSpaceBar} from 'components/useInfo/modal/Validations';
import {EmailRule, Form, GroupItem, Item, Label} from 'devextreme-react/form';
import useModal from 'hooks/useModal';
import {updateUserInfo} from 'models/config/myPage/MyPageConfig';
import {useCallback, useRef} from 'react';
import {useLoaderData} from 'react-router-dom';
import {getTheme} from 'config/theme';
import styled from 'styled-components';
import localizedString from 'config/localization';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import icon from 'assets/image/icon/report/query_search.png';

const theme = getTheme();
const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const UserInfoManagement = () => {
  const userInfoFormData = useLoaderData();
  const {openModal, success, alert, confirm} = useModal();
  const ref = useRef();

  const getValidation = (item) => {
    if (item == 'userNm') {
      return [{type: 'required', message: localizedString.requiredUserNm}];
    }
    return [];
  };

  const cancelOnClick = () => {
    if (ref.current) {
      const formData = ref.current.instance.option().formData;
      formData.userNm= '';
      formData.email= '';
      formData.email2= '';
      formData.hpNo= '';
      formData.telNo= '';
      ref.current.instance.repaint();
    }
  };

  const onClick = () => {
    if (ref.current) {
      const formData = ref.current.instance.option().formData;
      if (formData.userNm === '' && !formData.userNm) {
        alert(localizedString.userNmNoEmpty);
        return;
      }
      updateUserInfo(formData).then((res) => {
        if (res.status == 200) {
          success(localizedString.userInfoUpdateSuccess);
        } else {
          alert(localizedString.saveExceptionMsg);
        }
      });
    }
  };

  const validateForm = useCallback((e) => {
    e.component.validate();
  }, []);

  return (
    <Wrapper>
      <Form
        ref={ref}
        width={'70%'}
        formData={userInfoFormData}
        onContentReady={validateForm}
      >
        <GroupItem
          cssClass='dx-field-group-wrapper'
          colCount={1}
          caption={localizedString.personalInfo}
        >
          <Item
            dataField='userId'
            validationRules={getValidation('userNm')}
            editorOptions={{
              readOnly: true
            }}
          >
            <Label showColon={false}>
              {localizedString.userId}
            </Label>
          </Item>
          <Item
            dataField='userNm'
            editorType='dxTextBox'
            validationRules={getValidation('userNm')}
            editorOptions={{
              showClearButton: true,
              onKeyDown: preventInputSpaceBar
            }}
          >
            <Label showColon={false}>
              {localizedString.userName}
            </Label>
          </Item>
          <Item
            dataField='email'
            editorType='dxTextBox'
            editorOptions={{
              showClearButton: true,
              valueChangeEvent: 'keyup',
              onKeyDown: preventInputSpaceBar
            }}
          >
            <EmailRule message={localizedString.invalideEmailRule}/>
            <Label showColon={false}>
              {localizedString.email + ' 1'}
            </Label>
          </Item>
          <Item
            dataField='email2'
            editorType='dxTextBox'
            editorOptions={{
              showClearButton: true,
              valueChangeEvent: 'keyup',
              onKeyDown: preventInputSpaceBar
            }}
          >
            <EmailRule message={localizedString.invalideEmailRule}/>
            <Label showColon={false}>
              {localizedString.email + ' 2'}
            </Label>
          </Item>
          <Item // 전화번호 형식
            dataField='telNo'
            editorType='dxTextBox'
            editorOptions={{
              showClearButton: true,
              onKeyDown: preventInputSpaceBar
            }}
          >
            <Label showColon={false}>
              {localizedString.telNo}
            </Label>
          </Item>
          <Item
            dataField='hpNo'
            editorType='dxTextBox'
            editorOptions={{
              showClearButton: true,
              onKeyDown: preventInputSpaceBar
            }}
          >
            <Label showColon={false}>
              {localizedString.cellPhoneNo}
            </Label>
          </Item>
          <Item
            editorType='custom'
            render={() => (
              <CommonButton
                height='30px'
                width='105px'
                type='secondary'
                borderRadius={'4px'}
                font={theme.font.smallButton}
                onClick = {() => {
                  openModal(ModifyPasswordModal);
                }}
              >
                <img src={icon}/>
                {localizedString.passwordChange}
              </CommonButton>
            )}
          >
            <Label showColon={false}>
              {localizedString.passwordChange}
            </Label>
          </Item>
        </GroupItem>
      </Form>
      <ButtonDiv>
        <CommonButton
          width={'100px'}
          onClick={() =>
            confirm(localizedString.confirmResetMsg, () => cancelOnClick)
          }
        >{localizedString.cancel}</CommonButton>
        <CommonButton
          width={'100px'}
          onClick={onClick}
        >{localizedString.save}</CommonButton>
      </ButtonDiv>
    </Wrapper>
  );
};
export default UserInfoManagement;
