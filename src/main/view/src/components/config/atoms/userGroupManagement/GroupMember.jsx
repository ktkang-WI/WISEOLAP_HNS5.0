import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, SearchPanel, Selection, Paging}
  from 'devextreme-react/data-grid';
import {Button} from 'devextreme-react';
import {useCallback, useContext} from 'react';
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import localizedString from 'config/localization';
import {getRefInstance} from 'components/config/utility/utility';
import Form from 'devextreme/ui/form';
import styled from 'styled-components';
import useModal from 'hooks/useModal';

const StyledGrid = styled(DataGrid)`
  & .dx-toolbar-items-container {
    display: -webkit-inline-box;
    position: absolute;
    right: 0px;
    top: -38px;
  }

  & .dx-datagrid-header-panel .dx-toolbar {
    margin-bottom: 0px;
  }
`;

const GroupMember = () => {
  const {alert} = useModal();
  const getContext = useContext(UserGroupContext);
  const [groupMemberUsers, setGroupMemberUsers] =
  getContext.state.groupMemberUsers;
  const [groupNotMemberUsers, setGroupNotMemberUsers] =
  getContext.state.groupNotMemberUsers;
  const [, setGroupDetailInfo] = getContext.state.groupDetailInfo;
  const groupMemberUserRef = getContext.ref.groupMemberUserRef;
  const groupNotMemberUserRef = getContext.ref.groupNotMemberUserRef;

  const getGroupInfo = () => {
    const groupInfoRef = getRefInstance(Form, 'group-info');
    return groupInfoRef.option('formData');
  };

  const moveUserToGroup = useCallback(() => {
    const group = getGroupInfo();
    if (!group || Object.keys(group).length == 0) {
      alert('그룹을 먼저 선택해 주세요.');
      return;
    }

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
    setGroupDetailInfo(group);
  }, [groupMemberUsers, groupNotMemberUsers]);


  const moveGroupToUser = useCallback(() => {
    const group = getGroupInfo();
    if (!group || Object.keys(group).length == 0) {
      alert('그룹을 먼저 선택해 주세요.');
      return;
    }

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
    setGroupDetailInfo(group);
  }, [groupMemberUsers, groupNotMemberUsers]);

  return (
    <Wrapper display='flex'>
      <Wrapper>
        <Panel title={localizedString.groupUser}>
          <DataGrid
            height={'100%'}
            dataSource={groupMemberUsers}
            showBorders={true}
            ref={groupMemberUserRef}
            allowColumnResizing={true}
          >
            <Selection
              mode="multiple"
              showCheckBoxesMode="always"
            />
            <Paging
              enabled={false}/>
            <Column
              dataField="userId"
              caption={localizedString.userId}
            >
            </Column>
            <Column
              dataField="userNm"
              caption={localizedString.userName}
              dataType="string"
              format="currency"
            />
          </DataGrid>
        </Panel>
      </Wrapper>
      <Wrapper size='20px' display='flex' direction='column' center='center'>
        <Button
          style={{margin: '5px 10px'}}
          onClick={moveUserToGroup}
          width={30}
          height={60}
        >
          &#x27E8;
        </Button>
        <Button
          style={{margin: '5px 10px'}}
          onClick={moveGroupToUser}
          width={30}
          height={60}
        >
          &#x27E9;
        </Button>
      </Wrapper>
      <Wrapper>
        <Panel title={localizedString.userList}>
          <StyledGrid
            height={'100%'}
            dataSource={groupNotMemberUsers}
            showBorders={true}
            ref={groupNotMemberUserRef}
            allowColumnResizing={true}
          >
            <Selection
              mode="multiple"
              showCheckBoxesMode="always"
            />
            <Paging
              enabled={false}/>
            <SearchPanel
              className='test'
              visible={true}
            />
            <Column
              dataField="userId"
              caption={localizedString.userId}
            />
            <Column
              dataField="userNm"
              caption={localizedString.userName}
              dataType="string"
              format="currency"
            />
          </StyledGrid>
        </Panel>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupMember;
