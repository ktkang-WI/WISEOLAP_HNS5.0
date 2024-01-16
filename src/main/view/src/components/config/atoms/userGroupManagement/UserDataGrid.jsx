
import {UserManagementContext}
  from 'components/config/molecules/userGroupManagement/UserManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import {useContext} from 'react';

const UserDataGrid = () => {
  const getContext = useContext(UserManagementContext);

  const [usersFormat] = getContext.state.usersFormat;
  const [, setUserDetailInfo] = getContext.state.userDetailInfo;

  const handleRowClick = (e) => {
    const userId = e.data.userId;
    const selectedUser =
      usersFormat.filter((item) => item.userId === userId)[0].userDetailInfo;
    setUserDetailInfo(selectedUser);
  };

  /*
  const panelTitle = (title) => {
    return '{1} + {2} = {3}'.format(4, 5, 9);
  };
  */

  return (
    <Panel title='사용자 (34명)'>
      <DataGrid
        height={600}
        dataSource={usersFormat}
        showBorders={true}
        onRowClick={handleRowClick}
      >
        <Column
          dataField="userId"
          caption="사용자 ID"
        />
        <Column
          dataField="userNm"
          caption="사용자 명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpNm"
          caption="그룹 명"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Panel>
  );
};

export default UserDataGrid;
