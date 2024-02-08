

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  AsyncRule,
  GroupItem, Item, Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';
import localizedString from 'config/localization';
import {duplicateValidation} from 'components/config/utility/utility';

const UserInfo = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [userDetailInfo] = getContext.state.userDetailInfo;
  const [usersFormat] = getContext.state.usersFormat;
  const [groupsFormat] = getContext.state.groupsFormat;

  const userInfoRef = getContext.ref.userInfoRef;

  // selectBox DataSource
  const groups = groupsFormat.map((row) => {
    return {
      grpId: row.grpId,
      grpNm: row.grpNm
    };
  });
  const mode = ['ADMIN', 'VIEW'];

  const asyncValidation = (params) => {
    const invalidValues = usersFormat
        .filter((row) => row.userId != userDetailInfo?.userId)
        .map((row) => row.userId);
    return duplicateValidation(params.value, invalidValues, userInfoRef);
  };

  const passwordValidation = (params) => {
    const passwd = userInfoRef.current._instance.getEditor('passwd')
        .option('value');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(params.value === passwd);
      }, 500);
    });
  };

  return (
    <Panel title={localizedString.userInfomation}>
      <Form
        formData={userDetailInfo}
        ref={userInfoRef}
      >
        <GroupItem
          colCount={1}>
          <Item
            dataField="userNo"
            editorOptions={{
              visible: false
            }}
          >
            <Label>{'이메일'}</Label>
          </Item>
          <SimpleItem
            dataField="userId"
            editorType="dxTextBox"
          >
            <RequiredRule message="사용자 ID 를 입력 해주세요."/>
            <AsyncRule
              message="해당 사용자 ID 는 이미 등록되어 있습니다."
              validationCallback={asyncValidation}
            />
            <Label>{localizedString.userId}</Label>
          </SimpleItem>
          <SimpleItem dataField="userNm">
            <RequiredRule message="사용자 명 을 입력 해주세요."/>
            <Label>{localizedString.userName}</Label>
          </SimpleItem>
          <SimpleItem
            dataField="passwd"
            editorOptions={{
              mode: 'password'
            }}
          >
            <RequiredRule message="비밀번호 를 입력 해주세요."/>
            <Label>{localizedString.password}</Label>
          </SimpleItem>
          <SimpleItem
            dataField="passwdConfirm"
            editorOptions={{
              mode: 'password'
            }}
          >
            <RequiredRule message="비밀번호 를 입력 해주세요."/>
            <AsyncRule
              message={localizedString.checkPasword}
              validationCallback={passwordValidation}
            />
            <Label>{localizedString.passwordConfirm}</Label>
          </SimpleItem>
          <Item dataField="email1">
            <Label>{'이메일'}</Label>
          </Item>
          <Item dataField="email2">
            <Label>{'이메일2'}</Label>
          </Item>
          <Item dataField="telNo">
            <Label>{'전화번호'}</Label>
          </Item>
          <SimpleItem
            dataField="grpId"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: groups,
              displayExpr: 'grpNm',
              valueExpr: 'grpId'
            }}
          >
            <RequiredRule message="그룹 명 을 선택 해주세요."/>
            <Label>{localizedString.groupName}</Label>
          </SimpleItem>
          <SimpleItem
            dataField="userRunMode"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: mode
            }}
          >
            <RequiredRule message="사용자 실행모드 를 선택 해주세요."/>
            <Label>{localizedString.userRunMode}</Label>
          </SimpleItem>
          <Item
            dataField="grpRunMode"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: mode,
              disabled: true
            }}
          >
            <Label>{localizedString.groupRunMode}</Label>
          </Item>
          <Item
            dataField="userDesc"
            editorType='dxTextArea'
          >
            <Label>{localizedString.description}</Label>
          </Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default UserInfo;
