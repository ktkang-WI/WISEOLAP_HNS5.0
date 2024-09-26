import DataGrid,
{Column, SearchPanel, Selection} from 'devextreme-react/data-grid';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import icoEdit from 'assets/image/icon/auth/ico_edit.png';
import React, {useContext, useEffect, useState} from 'react';
import {AuthorityContext, getFindDifferentIds, getUserGroupKeys}
  from 'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const UserList = ({onRowClick, dependency}) => {
  const getContext = useContext(AuthorityContext);

  // state
  const [dataSource, setDataSource] = useState(getContext.state.user || []);
  const data = getContext.state.data;
  const [currentTab] = getContext.state.currentTab;
  const pageReload = getContext.state.pageReload;
  const [action] = getContext.state.action;
  // TODO: 권한별로 키유무 만들어야함.
  useEffect(() => {
    if (!data?.next) return;
    const key =
      getUserGroupKeys(currentTab, data).map((d) => (d.userNo));
    const editsKey = getFindDifferentIds(currentTab, data);
    setDataSource(dataSource.map((d) => {
      let isAuth = 'none';
      if (key.includes(d.userNo)) {
        isAuth = 'visible';
      }
      if (editsKey.includes(d.userNo)) {
        isAuth = 'edit';
      }
      return {
        ...d,
        isAuth: isAuth
      };
    }));
  }, [pageReload, action, dependency]);
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
        <SearchPanel
          visible={true}
          width={250}
        />
        <Column
          dataField="isAuth"
          caption=""
          dataType="string"
          format="currency"
          width="30px"
          cellRender={({value}) => {
            if (value === 'visible') {
              return <img height={'15px'} src={passwordIcon}/>;
            } else if (value === 'edit') {
              return <img height={'15px'} src={icoEdit}/>;
            }
          }}
        />
        <Column
          dataField="userId"
          caption={localizedString.userId}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="userNm"
          caption={localizedString.userName}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="string"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(UserList);
