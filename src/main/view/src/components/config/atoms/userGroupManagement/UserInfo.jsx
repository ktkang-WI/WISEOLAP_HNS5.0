

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
  const getContext = useContext(UserGroupContext);
  const [userDetailInfo] = getContext.state.userDetailInfo;

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
          >
            <Label>{localizedString.groupName}</Label>
          </Item>
          <Item
            dataField="userRunMode"
            editorType="dxSelectBox"
          >
            <Label>{localizedString.userRunMode}</Label>
          </Item>
          <Item
            dataField="grpRunMode"
            editorType="dxSelectBox"
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
