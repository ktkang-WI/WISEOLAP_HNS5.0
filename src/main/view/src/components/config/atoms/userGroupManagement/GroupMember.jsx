import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {Button} from 'devextreme-react';
import {useCallback, useContext, useRef} from 'react';
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import localizedString from 'config/localization';

const GroupMember = () => {
  const getContext = useContext(UserGroupContext);
  const [groupMemberUsers, setGroupMemberUsers] =
  getContext.state.groupMemberUsers;
  const [groupNotMemberUsers, setGroupNotMemberUsers] =
  getContext.state.groupNotMemberUsers;

  const groupMemberUserRef = useRef();
  const groupNotMemberUserRef = useRef();

  const moveUserToGroup = useCallback(() => {
    const selectedData = groupNotMemberUserRef
        .current._instance.getSelectedRowsData();
    const newGroupNotMmemberUsers = groupNotMemberUsers.filter((row) => {
      let check = true;
      for (let i=0; i<selectedData.length; i++) {
        if (selectedData[i].userId === row.userId) {
          check = false;
          break;
        }
      }
      return check;
    });

    setGroupMemberUsers(groupMemberUsers.concat(selectedData));
    setGroupNotMemberUsers(newGroupNotMmemberUsers);
  }, [groupMemberUsers, groupNotMemberUsers]);


  const moveGroupToUser = useCallback(() => {
    const selectedData = groupMemberUserRef
        .current._instance.getSelectedRowsData();
    const newGroupMmemberUsers = groupMemberUsers.filter((row) => {
      let check = true;
      for (let i=0; i<selectedData.length; i++) {
        if (selectedData[i].userId === row.userId) {
          check = false;
          break;
        }
      }
      return check;
    });

    setGroupNotMemberUsers(groupNotMemberUsers.concat(selectedData));
    setGroupMemberUsers(newGroupMmemberUsers);
  }, [groupMemberUsers, groupNotMemberUsers]);

  return (
    <Wrapper display='flex'>
      <Wrapper>
        <Panel title={localizedString.groupUser}>
          <DataGrid
            height={263}
            dataSource={groupMemberUsers}
            showBorders={true}
            ref={groupMemberUserRef}
          >
            <Selection
              mode="multiple"
              showCheckBoxesMode="always"
            />
            <Column
              dataField="userId"
              caption={localizedString.userId}
            />
            <Column
              dataField="userNm"
              caption={localizedString.userName}
              dataType="varchar"
              format="currency"
            />
          </DataGrid>
        </Panel>
      </Wrapper>
      <Wrapper size='20px' display='flex'>
        <Wrapper display='flex' direction='column' center='center'>
          <Button onClick={moveUserToGroup} height={30}>&#8592;</Button>
          <Button onClick={moveGroupToUser} height={30}>&#8594;</Button>
        </Wrapper>
      </Wrapper>
      <Wrapper>
        <Panel title={localizedString.userList}>
          <DataGrid
            height={263}
            dataSource={groupNotMemberUsers}
            showBorders={true}
            ref={groupNotMemberUserRef}
          >
            <Selection
              mode="multiple"
              showCheckBoxesMode="always"
            />
            <Column
              dataField="userId"
              caption={localizedString.userId}
            />
            <Column
              dataField="userNm"
              caption={localizedString.userName}
              dataType="varchar"
              format="currency"
            />
          </DataGrid>
        </Panel>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupMember;
