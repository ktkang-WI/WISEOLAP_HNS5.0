import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import UserDataGrid
  from 'components/config/atoms/userGroupManagement/UserDataGrid';
import UserInfo from
  'components/config/atoms/userGroupManagement/UserInfo';
import {useState} from 'react';

const UserManagement = () => {
  const [row, setRow] = useState();

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper width='40%' style={{marginRight: '20px'}}>
        <UserDataGrid setRow={setRow}/>
      </Wrapper>
      <Wrapper width='60%' overflow='hidden'>
        <UserInfo row={row}/>
      </Wrapper>
    </Wrapper>
  );
};

export default UserManagement;
