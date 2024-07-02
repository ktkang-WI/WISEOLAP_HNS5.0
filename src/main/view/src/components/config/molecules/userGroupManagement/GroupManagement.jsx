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
      <Wrapper width='40%' style={{marginRight: '20px'}}>
        <GroupDataGrid />
      </Wrapper>
      <Wrapper width='60%' direction='column'>
        <Wrapper height='40%'>
          <GroupInfo />
        </Wrapper>
        <Wrapper height='60%'>
          <GroupMember />
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupManagement;
