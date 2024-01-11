import 'devextreme/data/odata/store';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import Form, {
  GroupItem, Item, SimpleItem
} from 'devextreme-react/form';
import {TextArea} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {useLoaderData} from 'react-router-dom';
import {useState} from 'react';


const UserManagement = () => {
  const {userGroupManagement} = useLoaderData();
  const [userDetailInfo, setUserDetailInfo] = useState();


  const handleRowClick = (e) => {
    const userId = e.data.userId;
    const users = userGroupManagement.usersFormat;
    const selectedUser =
      users.filter((item) => item.userId === userId)[0].userDetailInfo;
    setUserDetailInfo(selectedUser);
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper size="650px">
        <Panel title='사용자 (34명)'>
          <DataGrid
            height={600}
            dataSource={userGroupManagement.usersFormat}
            showBorders={true}
            onRowClick={handleRowClick}
          >
            <Column
              dataField="userId"
              caption="사용자 ID"
            />
            <Column
              dataField="userNm"
              caption="사용자 명"
              dataType="varchar"
              format="currency"
            />
            <Column
              dataField="grpNm"
              caption="그룹 명"
              dataType="varchar"
              format="currency"
            />
          </DataGrid>
        </Panel>
      </Wrapper>
      <Wrapper size="2">
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
      </Wrapper>
    </Wrapper>
  );
};

export default UserManagement;
