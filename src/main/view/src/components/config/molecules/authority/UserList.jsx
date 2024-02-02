import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import React, {useContext, useEffect, useState} from 'react';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const UserList = ({setRow}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [users, setUsers] = useState([]);
  const [data] = authoritycontext.state.data;

  useEffect(() => {
    const dataUsers = data.filter((row) => row.user);
    models.Authority.getUsers()
        .then((response) => {
          const authUserNoList = dataUsers.map((row) => row.user.userNo);
          const newUsers = response.data.data.map((row) => {
            return {
              ...row,
              isAuth: authUserNoList.includes(row.userNo) ? true: false
            };
          });
          setUsers(newUsers);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <Wrapper>
      <Title title={localizedString.userList}></Title>
      <DataGrid
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
