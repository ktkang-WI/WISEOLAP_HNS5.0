

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, Label, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';
import localizedString from 'config/localization';

const UserInfo = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [userDetailInfo] = getContext.state.userDetailInfo;
  const [groupsFormat] = getContext.state.groupsFormat;

  // selectBox DataSource
  const groups = groupsFormat.map((row) => row.grpNm);
  const mode = ['ADMIN', 'VIEW'];

  return (
    <Panel title={localizedString.userInfomation}>
      <Form
        formData={userDetailInfo}
      >
        <GroupItem
          colCount={1}>
          <Item dataField="userId">
            <Label>{localizedString.userId}</Label>
          </Item>
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
