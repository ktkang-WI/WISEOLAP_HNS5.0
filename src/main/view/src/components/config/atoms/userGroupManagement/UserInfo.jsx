

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, SimpleItem
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
          <Item dataField="userId" caption={localizedString.userId}></Item>
          <Item dataField="userNm" caption={localizedString.userName}></Item>
          <Item dataField="email1" caption="이메일 1"></Item>
          <Item dataField="email2" caption="이메일 2"></Item>
          <Item dataField="telNo" caption="휴대전화번호"></Item>
          <Item
            dataField="grpNm"
            caption={localizedString.groupName}
            editorType="dxSelectBox"></Item>
          <Item
            dataField="userRunMode"
            caption={localizedString.userRunMode}
            editorType="dxSelectBox"></Item>
          <Item dataField="grpRunMode" caption={localizedString.groupRunMode}>
          </Item>
          <SimpleItem
            dataField="userDesc"
            caption={localizedString.description}
          >
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
