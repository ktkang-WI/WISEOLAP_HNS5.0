import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import UserDataGrid
  from 'components/config/atoms/userGroupManagement/UserDataGrid';
import UserInfo from
  'components/config/atoms/userGroupManagement/UserInfo';

const UserManagement = () => {
  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper size="650px">
        <UserDataGrid />
      </Wrapper>
      <Wrapper size="2">
        <UserInfo />
      </Wrapper>
    </Wrapper>
  );
};

export default UserManagement;
