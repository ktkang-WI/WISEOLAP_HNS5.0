import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import React, {useContext} from 'react';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const UserList = ({onRowClick}) => {
  const getContext = useContext(AuthorityContext);

  // state
  const dataSource = getContext.state.user;

  const HandleClick = (e) => {
    onRowClick(e);
  };
  return (
    <Wrapper>
      <Title title={localizedString.userList}></Title>
      <DataGrid
        elementAttr={{
          class: 'user-list'
        }}
        height={'90%'}
        dataSource={dataSource}
        showBorders={true}
        onRowClick={HandleClick}
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
