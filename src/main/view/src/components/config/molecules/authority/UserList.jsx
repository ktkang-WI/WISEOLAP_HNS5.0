import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import {useContext, useEffect, useState} from 'react';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';

const UserList = ({setRow}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [users, setUsers] = useState([]);
  const [data] = authoritycontext.state.data;

  useEffect(() => {
    const dataUsers = data.filter((row) => row.user);
    if (dataUsers.length > 0) {
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
    }
  }, []);

  const handleRowClick = ({data}) => {
    setRow({data});
  };

  return (
    <Wrapper>
      <Title title={'사용자 목록'}></Title>
      <DataGrid
        height={600}
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
          caption="사용자 ID"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="userNm"
          caption="사용자명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpNm"
          caption="그룹명"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default UserList;
