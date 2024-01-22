
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import _ from 'lodash';
import {useContext, useRef} from 'react';

const UserDataGrid = () => {
  const getContext = useContext(UserGroupContext);

  const [usersFormat] = getContext.state.usersFormat;
  const [userDetailInfo, setUserDetailInfo] = getContext.state.userDetailInfo;

  const ref = useRef();

  const handleRowClick = (e) => {
    const userId = e.data.userId;
    const selectedUser =
      usersFormat.filter((item) => item.userId === userId)[0].userDetailInfo;
    setUserDetailInfo(selectedUser);
  };

  if (_.isEmpty(userDetailInfo)) {
    ref.current?._instance.clearSelection();
  }

  return (
    <Panel title={'사용자 (' + usersFormat.length + '명)'}>
      <DataGrid
        height={600}
        dataSource={usersFormat}
        showBorders={true}
        onRowClick={handleRowClick}
        ref={ref}
      >
        <Selection mode="single" />
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
