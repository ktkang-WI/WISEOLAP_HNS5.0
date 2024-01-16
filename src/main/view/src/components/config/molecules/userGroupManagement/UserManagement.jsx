import 'devextreme/data/odata/store';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useLoaderData} from 'react-router-dom';
import {createContext, useState} from 'react';
import UserDataGrid
  from 'components/config/atoms/userGroupManagement/UserDataGrid';
import UserInfo from
  'components/config/atoms/userGroupManagement/UserInfo';

export const UserManagementContext = createContext();

const UserManagement = () => {
  const {userGroupManagement} = useLoaderData();
  const [usersFormat, setUsersFormat] =
    useState(userGroupManagement.usersFormat);
  const [userDetailInfo, setUserDetailInfo] = useState();

  const context = {
    state: {
      usersFormat: [usersFormat, setUsersFormat],
      userDetailInfo: [userDetailInfo, setUserDetailInfo]
    }
  };


  return (
    <UserManagementContext.Provider
      value={context}
    >
      <Wrapper display='flex' direction='row'>
        <Wrapper size="650px">
          <UserDataGrid />
        </Wrapper>
        <Wrapper size="2">
          <UserInfo />
        </Wrapper>
      </Wrapper>
    </UserManagementContext.Provider>
  );
};

export default UserManagement;
