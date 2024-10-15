
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
// eslint-disable-next-line max-len
import DataGrid, {Column, SearchPanel, Selection, Paging} from 'devextreme-react/data-grid';
import _ from 'lodash';
import {useContext} from 'react';
import localizedString from 'config/localization';
import {handleRowClick} from 'components/config/utility/utility';

const UserDataGrid = () => {
  const getContext = useContext(UserGroupContext);

  const [usersFormat] = getContext.state.usersFormat;
  const [userDetailInfo, setUserDetailInfo] = getContext.state.userDetailInfo;
  const userDataGridRef = getContext.ref.userDataGridRef;

  if (_.isEmpty(userDetailInfo)) {
    userDataGridRef.current?._instance.clearSelection();
  }

  return (
    <Panel title={'사용자 (' + usersFormat.length + '명)'}>
      <DataGrid
        height={'100%'}
        dataSource={usersFormat}
        showBorders={true}
        onRowClick={({data}) =>
          handleRowClick(data.userDetailInfo, setUserDetailInfo)}
        allowColumnResizing={true}
        ref={userDataGridRef}
      >
        <Selection mode="single" />
        <Paging
          enabled={false}/>
        <SearchPanel
          visible={true}
        />
        <Column
          dataField="userId"
          caption={localizedString.userId}
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
    </Panel>
  );
};

export default UserDataGrid;
