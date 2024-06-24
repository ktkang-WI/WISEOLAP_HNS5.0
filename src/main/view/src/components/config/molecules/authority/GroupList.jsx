import {AuthorityContext, getUserGroupKeys}
  from 'components/config/organisms/authority/Authority';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import React, {useContext, useEffect, useState} from 'react';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
const GroupList = ({onRowClick}) => {
  // context
  const getContext = useContext(AuthorityContext);

  // state
  const [dataSource, setDataSource] = useState(getContext.state.group);
  const data = getContext.state.data;
  const [currentTab] = getContext.state.currentTab;
  const [action] = getContext.state.action;
  // TODO: 권한별로 키유무 만들어야함.
  useEffect(() => {
    if (!data?.next) return;
    const key = getUserGroupKeys(currentTab, data);
    setDataSource(dataSource.map((d) => {
      return {
        isAuth: key.includes(d.grpId),
        ...d
      };
    }));
  }, [currentTab, action]);
  const HandleClick = (e) => {
    onRowClick(e);
  };
  return (
    <Wrapper>
      <Title title={localizedString.groupList}></Title>
      <DataGrid
        elementAttr={{
          class: 'group-list'
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
          dataType="boolean"
          format="currency"
          width="30px"
          cellRender={({value}) => {
            if (value) {
              return <img height={'15px'} src={passwordIcon}/>;
            }
          }}
        />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpDesc"
          caption={localizedString.description}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(GroupList);
