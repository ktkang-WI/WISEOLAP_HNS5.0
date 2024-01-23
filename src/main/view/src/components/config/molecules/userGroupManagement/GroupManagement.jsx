import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {createContext} from 'react';
import GroupDataGrid
  from 'components/config/atoms/userGroupManagement/GroupDataGrid';
import GroupInfo from 'components/config/atoms/userGroupManagement/GroupInfo';
import GroupMember
  from 'components/config/atoms/userGroupManagement/GroupMember';

export const GroupManagementContext = createContext();

const GroupManagement = () => {
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
