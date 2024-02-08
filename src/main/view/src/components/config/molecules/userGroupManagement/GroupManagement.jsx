import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {createContext, useContext, useEffect} from 'react';
import GroupDataGrid
  from 'components/config/atoms/userGroupManagement/GroupDataGrid';
import GroupInfo from 'components/config/atoms/userGroupManagement/GroupInfo';
import GroupMember
  from 'components/config/atoms/userGroupManagement/GroupMember';
import {Group} from 'models/config/userGroupManagement/UserGroupManagement';
import {UserGroupContext} from
  'components/config/organisms/userGroupManagement/UserGroupManagement';

export const GroupManagementContext = createContext();

const GroupManagement = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [, setGroupDetailInfo] = getContext.state.groupDetailInfo;
  const [, setGroupMemberUsers] = getContext.state.groupMemberUsers;
  const [, setGroupNotMemberUsers] = getContext.state.groupNotMemberUsers;

  useEffect(() => {
    console.log('GroupManagement.jsx Mount!!');
    const group = new Group({});
    group.getGroupNotMemberUsers()
        .then((users) => {
          setGroupNotMemberUsers(users);
        })
        .catch(() => {
          throw new Error('Falied get Users');
        });
    setGroupDetailInfo(new Group({}));
    setGroupMemberUsers([]);
  }, []);

  return (
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
  );
};

export default GroupManagement;
