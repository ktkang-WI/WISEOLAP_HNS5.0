import ModifyPasswordModal from 'components/useInfo/modal/ModifyPasswordModal';
import {preventInputSpaceBar} from 'components/useInfo/modal/Validations';
import {Button} from 'devextreme-react';
import {EmailRule, Form, GroupItem, Item, Label} from 'devextreme-react/form';
import useModal from 'hooks/useModal';
import {updateUserInfo} from 'models/config/myPage/MyPageConfig';
import {useCallback, useRef} from 'react';
import {useLoaderData} from 'react-router-dom';
import styled from 'styled-components';
import localizedString from 'config/localization';
import middleDot from 'assets/image/component/middleDot.png';

const Content = styled.div`
  height:100%;
  width:100%;
  margin: 10px;
  background: #ffffff;
  border: 1px solid #D4D7DC;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
`;

const Img = styled.img`
  src: ${(props) => props.src};
  vertical-align: middle;
  padding: 3px;
`;

const ButtonDiv = styled.div`
  height: 100px;
  vertical-align: center;
`;

const StyledDiv = styled.div`
  display: inline-block;
  left: 0px;
  position: absolute;
`;

const StyledSpan = styled.span`
  padding-right: 200px;
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
    <>
      <Content>
        <Form
          ref={ref}
          width={'500px'}
          formData={userInfoFormData}
          onContentReady={validateForm}
        >
          <GroupItem colCount={1} caption={localizedString.personalInfo}>
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
          </GroupItem>
        </Form>
        <StyledDiv>
          <StyledSpan>
            <Img src={middleDot}/>{localizedString.passwordChange}
          </StyledSpan>
          <Button
            onClick={() => {
              openModal(ModifyPasswordModal);
            }}
          >
            {localizedString.passwordChange}
          </Button>
        </StyledDiv>
        <ButtonDiv>
          <button
            onClick={() =>
              confirm(localizedString.confirmResetMsg, () => cancelOnClick)
            }
          >{localizedString.cancel}</button>
          <button
            onClick={onClick}
          >{localizedString.save}</button>
        </ButtonDiv>
      </Content>
    </>
  );
};
export default UserInfoManagement;
