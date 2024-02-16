import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import React, {useContext, useEffect, useState} from 'react';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';
import {User} from 'models/config/userGroupManagement/UserGroupManagement';

const UserList = ({setRow}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [users, setUsers] = useState([]);
  const [data] = authoritycontext.state.data;
  const userListRef = authoritycontext.ref.userListRef;

  useEffect(() => {
    const dataUsers = data.filter((row) => row.user);
    models.Authority.getUsers()
        .then((response) => {
          const authUserNoList = dataUsers
              .filter((row) => {
                if (row.dsViews) {
                  if (row.dsViews?.dsViewId.length > 0) {
                    return row;
                  }
                } else {
                  return row;
                }
              })
              .map((row) => row.user.userNo);
          const users = response.data.data;
          const newUsers = users.map((user) => {
            const newUser = new User(user);
            newUser.isAuth = authUserNoList.includes(user.userNo) ?
            true : false;
            return newUser;
          });
          setUsers(newUsers);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, [data]);

  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <Wrapper>
      <Title title={localizedString.userList}></Title>
      <DataGrid
        ref={userListRef}
        height={'90%'}
        dataSource={users}
        showBorders={true}
        onRowClick={handleRowClick}
      >
        <Selection mode="single" />
        <Column
          dataField="isAuth"
          caption=""
          dataType="varchar"
          format="currency"
          width="30px"
          cellRender={({value}) => {
            if (value) {
              return <img height={'15px'} src={passwordIcon}/>;
            }
          }}
        />
        <Column
          dataField="userId"
          caption={localizedString.userId}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="userNm"
          caption={localizedString.userName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(UserList);
