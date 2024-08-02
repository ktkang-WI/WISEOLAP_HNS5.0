import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {useContext} from 'react';
import localizedString from 'config/localization';

const GroupDataGrid = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [groupsFormat] = getContext.state.groupsFormat;
  const [groupDetailInfo, setGroupDetailInfo] =
   getContext.state.groupDetailInfo;
  const [, setGroupMemberUsers] = getContext.state.groupMemberUsers;
  const [, setGroupNotMemberUsers] = getContext.state.groupNotMemberUsers;

  const groupDataGridRef = getContext.ref.groupDataGridRef;

  const handleRowClick = (e) => {
    const grpId = e.data.grpId;
    const selectedGroup =
    _.cloneDeep(groupsFormat.filter((item) => item.grpId === grpId)[0]);
    setGroupDetailInfo(selectedGroup.grpDetailInfo);
    setGroupMemberUsers(selectedGroup.grpMemberUser);
    setGroupNotMemberUsers(selectedGroup.grpNotMemberUser);
  };

  if (_.isEmpty(groupDetailInfo)) {
    groupDataGridRef.current?._instance.clearSelection();
  }

  return (
    <Panel title={'그룹 (' + groupsFormat.length + '개)'}>
      <DataGrid
        height='100%'
        dataSource={groupsFormat}
        showBorders={true}
        onRowClick={handleRowClick}
        ref={groupDataGridRef}
      >
        <Selection mode="single" />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="grpDesc"
          caption={localizedString.description}
          dataType="string"
          format="currency"
        />
      </DataGrid>
    </Panel>
  );
};

export default GroupDataGrid;
