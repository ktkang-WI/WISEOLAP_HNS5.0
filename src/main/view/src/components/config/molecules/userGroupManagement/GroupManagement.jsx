import 'devextreme/data/odata/store';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import Form, {
  GroupItem, Item, SimpleItem
} from 'devextreme-react/form';
import {TextArea} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {useLoaderData} from 'react-router-dom';
import {useState} from 'react';

const GroupManagement = () => {
  const {userGroupManagement} = useLoaderData();
  const [groupDetailInfo, setGroupDetailInfo] = useState();
  const [groupMemberUsers, setGroupMemberUsers] = useState();
  const [groupNotMemberUsers, setGroupNotMemberUsers] = useState();

  const handleRowClick = (e) => {
    const grpId = e.data.grpId;
    const groups = userGroupManagement.groupsFormat;
    const selectedGroup =
    groups.filter((item) => item.grpId === grpId)[0];
    setGroupDetailInfo(selectedGroup.grpDetailInfo);
    setGroupMemberUsers(selectedGroup.grpMemberUser);
    setGroupNotMemberUsers(selectedGroup.grpNotMemberUser);
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper size="650px">
        <Panel title='그룹 (9 개)'>
          <DataGrid
            height={600}
            dataSource={userGroupManagement.groupsFormat}
            showBorders={true}
            onRowClick={handleRowClick}
          >
            <Column
              dataField="grpNm"
              caption="그룹 명"
              dataType="varchar"
              format="currency"
            />
            <Column
              dataField="grpDesc"
              caption="설명"
              dataType="varchar"
              format="currency"
            />
          </DataGrid>
        </Panel>
      </Wrapper>
      <Wrapper size="2" display='flex' direction='column'>
        <Wrapper>
          <Panel title='그룹 정보'>
            <Form
              formData={groupDetailInfo}
            >
              <GroupItem colCount={1}>
                <Item
                  dataField="grpNm"
                  caption="그룹명"></Item>
                <SimpleItem dataField="grpDesc" caption="설명">
                  <TextArea
                    height={100}
                    width="100%"
                  />
                </SimpleItem>
                <Item
                  dataField="grpRunMode"
                  caption="그룹 실행모드"
                  editorType="dxSelectBox"></Item>
              </GroupItem>
            </Form>
          </Panel>
        </Wrapper>
        <Wrapper>
          <Wrapper display='flex'>
            <Wrapper>
              <Panel title='그룹소속사용자'>
                <DataGrid
                  height={263}
                  dataSource={groupMemberUsers}
                  showBorders={true}
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
                </DataGrid>
              </Panel>
            </Wrapper>
            <Wrapper>
              <Panel title='사용자목록'>
                <DataGrid
                  height={263}
                  dataSource={groupNotMemberUsers}
                  showBorders={true}
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
                </DataGrid>
              </Panel>
            </Wrapper>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupManagement;
