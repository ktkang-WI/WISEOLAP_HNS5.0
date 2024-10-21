

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  AsyncRule,
  EmptyItem,
  Item, Label, RequiredRule, SimpleItem
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
  const userDataGridRef = getContext.ref.userDataGridRef;

  // selectBox DataSource
  const groups = groupsFormat.map((row) => {
    return {
      grpId: row.grpId,
      grpNm: row.grpNm
    };
  });
  const mode = ['ADMIN', 'VIEW'];

  const asyncValidation = (params) => {
    const selectedRow = userDataGridRef.current._instance
        .getSelectedRowsData()[0];
    const invalidValues = usersFormat
        .filter((row) => row.userId != selectedRow?.userId)
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
        className='dx-fieldset custom-scrollbar'
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'100%'}
        formData={userDetailInfo}
        ref={userInfoRef}
      >
        <EmptyItem
          dataField="userNo"
          visible={false}
          editorOptions={{
            mode: 'number'
          }}
        >
        </EmptyItem>
        <SimpleItem
          dataField="userId"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationUserId}/>
          <AsyncRule
            message={localizedString.validationDupleUserNm}
            validationCallback={asyncValidation}
          />
          <Label>{localizedString.userId}</Label>
        </SimpleItem>
        <SimpleItem dataField="userNm">
          <RequiredRule message={localizedString.validationUserNm}/>
          <Label>{localizedString.userName}</Label>
        </SimpleItem>
        <Item
          dataField="compCode"
        >
          <Label>{'부서/회사 코드'}</Label>
        </Item>
        <Item
          dataField="accountCreateDt"
          editorOptions={{
            readOnly: true
          }}
        >
          <Label>{'계정 생성일'}</Label>
        </Item>
        {
          userDetailInfo.userNo === 0 &&
          <SimpleItem
            dataField="passwd"
            editorOptions={{
              mode: 'password'
            }}
          >
            <RequiredRule message={localizedString.validationPassword}/>
            <Label>{localizedString.password}</Label>
          </SimpleItem>
        }
        {
          userDetailInfo.userNo === 0 &&
          <SimpleItem
            dataField="passwdConfirm"
            editorOptions={{
              mode: 'password'
            }}
          >
            <RequiredRule message={localizedString.validationPassword}/>
            <AsyncRule
              message={localizedString.checkPasword}
              validationCallback={passwordValidation}
            />
            <Label>{localizedString.passwordConfirm}</Label>
          </SimpleItem>
        }
        <Item dataField="email1">
          <Label>{'이메일'}</Label>
        </Item>
        <Item dataField="email2">
          <Label>{'이메일2'}</Label>
        </Item>
        <Item dataField="telNo">
          <Label>{'전화번호'}</Label>
        </Item>
        <Item dataField="hpNo">
          <Label>{'휴대폰 번호'}</Label>
        </Item>
        <SimpleItem
          dataField="grpId"
          editorOptions={{
            readOnly: true
          }}
        >
          <Label>{'그룹 아이디'}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="grpId"
          editorType="dxSelectBox"
          editorOptions={{
            dataSource: groups,
            displayExpr: 'grpNm',
            valueExpr: 'grpId'
          }}
        >
          <RequiredRule message={localizedString.validationGroupNm}/>
          <Label>{localizedString.groupName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="userRunMode"
          editorType="dxSelectBox"
          editorOptions={{
            dataSource: mode
          }}
        >
          <RequiredRule message={localizedString.validationUserRunMode}/>
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
      </Form>
    </Panel>
  );
};

export default UserInfo;
