

import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';


const UserInfo = () => {
  const getContext = useContext(UserGroupContext);
  const [userDetailInfo] = getContext.state.userDetailInfo;

  return (

    <Panel title='사용자 정보'>
      <Form
        formData={userDetailInfo}
      >
        <GroupItem
          colCount={1}>
          <Item dataField="userId" caption="사용자 ID"></Item>
          <Item dataField="userNm" caption="사용자 명"></Item>
          <Item dataField="email1" caption="이메일 1"></Item>
          <Item dataField="email2" caption="이메일 2"></Item>
          <Item dataField="telNo" caption="휴대전화번호"></Item>
          <Item
            dataField="grpNm"
            caption="그룹 명"
            editorType="dxSelectBox"></Item>
          <Item
            dataField="userRunMode"
            caption="사용자 실행모드"
            editorType="dxSelectBox"></Item>
          <Item dataField="grpRunMode" caption="그룹 실행모드"></Item>
          <SimpleItem dataField="userDesc" caption="설명">
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
