import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useLoaderData} from 'react-router-dom';
import {createContext, useState} from 'react';
import GroupDataGrid
  from 'components/config/atoms/userGroupManagement/GroupDataGrid';
import GroupInfo from 'components/config/atoms/userGroupManagement/GroupInfo';
import GroupMember
  from 'components/config/atoms/userGroupManagement/GroupMember';

export const GroupManagementContext = createContext();

const GroupManagement = () => {
  const {userGroupManagement} = useLoaderData();
  const [groupsFormat, setGroupsFormat] =
    useState(userGroupManagement.groupsFormat);
  const [groupDetailInfo, setGroupDetailInfo] = useState();
  const [groupMemberUsers, setGroupMemberUsers] = useState();
  const [groupNotMemberUsers, setGroupNotMemberUsers] = useState();

  const context = {
    state: {
      groupsFormat: [groupsFormat, setGroupsFormat],
      groupDetailInfo: [groupDetailInfo, setGroupDetailInfo],
      groupMemberUsers: [groupMemberUsers, setGroupMemberUsers],
      groupNotMemberUsers: [groupNotMemberUsers, setGroupNotMemberUsers]
    }
  };


  return (
    <GroupManagementContext.Provider
      value={context}
    >
      <Wrapper display='flex' direction='row'>
        <Wrapper size="650px">
          <GroupDataGrid />
        </Wrapper>
        <Wrapper size="2" display='flex' direction='column'>
          <Wrapper>
            <GroupInfo />
          </Wrapper>
          <Wrapper>
            <GroupMember />
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </GroupManagementContext.Provider>
  );
};

export default GroupManagement;
