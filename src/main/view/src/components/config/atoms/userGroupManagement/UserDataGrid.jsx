
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
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
        ref={userDataGridRef}
      >
        <Selection mode="single" />
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
