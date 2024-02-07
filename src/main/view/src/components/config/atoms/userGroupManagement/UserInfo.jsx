

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  AsyncRule,
  GroupItem, Item, Label, SimpleItem
} from 'devextreme-react/form';
import {useContext, useRef} from 'react';
import localizedString from 'config/localization';

function sendRequest(value, list) {
  console.log('sendRequest value: ', value);
  // const invalidValues = usersFormat.map((row) => row.userId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!list.includes(value));
    }, 1000);
  });
};

const UserInfo = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [userDetailInfo] = getContext.state.userDetailInfo;
  const [usersFormat] = getContext.state.usersFormat;
  const [groupsFormat] = getContext.state.groupsFormat;

  // selectBox DataSource
  const groups = groupsFormat.map((row) => row.grpNm);
  const mode = ['ADMIN', 'VIEW'];

  const ref = useRef();

  const asyncValidation = (params) => {
    console.log('asyncValidation params: ', params);
    const invalidValues = usersFormat.map((row) => row.userId);
    return sendRequest(params.value, invalidValues, ref);
  };

  return (
    <Panel title={localizedString.userInfomation}>
      <Form
        formData={userDetailInfo}
        ref={ref}
      >
        <GroupItem
          colCount={1}>
          <SimpleItem
            dataField="userId"
            editorType="dxTextBox"
          >
            <AsyncRule
              message="해당 사용자 ID 는 이미 등록되어 있습니다."
              validationCallback={asyncValidation}
            />
            <Label>{localizedString.userId}</Label>
          </SimpleItem>
          <Item dataField="userNm">
            <Label>{localizedString.userName}</Label>
          </Item>
          <Item dataField="email1">
            <Label>{'이메일'}</Label>
          </Item>
          <Item dataField="email2">
            <Label>{'이메일2'}</Label>
          </Item>
          <Item dataField="telNo">
            <Label>{'전화번호'}</Label>
          </Item>
          <Item
            dataField="grpNm"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: groups
            }}
          >
            <Label>{localizedString.groupName}</Label>
          </Item>
          <Item
            dataField="userRunMode"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: mode
            }}
          >
            <Label>{localizedString.userRunMode}</Label>
          </Item>
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
          <SimpleItem
            dataField="userDesc"
          >
            <Label>{localizedString.description}</Label>
            <TextArea
              height={140}
              width="100%"
            />
          </SimpleItem>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default UserInfo;
