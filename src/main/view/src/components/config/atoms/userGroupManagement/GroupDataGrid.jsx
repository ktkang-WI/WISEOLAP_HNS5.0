import {GroupManagementContext}
  from 'components/config/molecules/userGroupManagement/GroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import {useContext} from 'react';

const GroupDataGrid = () => {
  const getContext = useContext(GroupManagementContext);
  const [groupsFormat] = getContext.state.groupsFormat;
  const [, setGroupDetailInfo] = getContext.state.groupDetailInfo;
  const [, setGroupMemberUsers] = getContext.state.groupMemberUsers;
  const [, setGroupNotMemberUsers] = getContext.state.groupNotMemberUsers;

  const handleRowClick = (e) => {
    const grpId = e.data.grpId;
    const selectedGroup =
    groupsFormat.filter((item) => item.grpId === grpId)[0];
    setGroupDetailInfo(selectedGroup.grpDetailInfo);
    setGroupMemberUsers(selectedGroup.grpMemberUser);
    setGroupNotMemberUsers(selectedGroup.grpNotMemberUser);
  };

  return (
    <Panel title='그룹 (9 개)'>
      <DataGrid
        height={600}
        dataSource={groupsFormat}
        showBorders={true}
        onRowClick={handleRowClick}
      >
        <Column
          dataField="grpNm"
          caption="그룹 명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpDesc"
          caption="설명"
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Panel>
  );
};

export default GroupDataGrid;
