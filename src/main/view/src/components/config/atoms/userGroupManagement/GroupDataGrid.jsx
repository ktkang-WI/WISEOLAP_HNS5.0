import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {useContext, useRef} from 'react';
import localizedString from 'config/localization';

const GroupDataGrid = () => {
  const getContext = useContext(UserGroupContext);
  const [groupsFormat] = getContext.state.groupsFormat;
  const [groupDetailInfo, setGroupDetailInfo] =
   getContext.state.groupDetailInfo;
  const [, setGroupMemberUsers] = getContext.state.groupMemberUsers;
  const [, setGroupNotMemberUsers] = getContext.state.groupNotMemberUsers;

  const ref = useRef();

  const handleRowClick = (e) => {
    const grpId = e.data.grpId;
    const selectedGroup =
    _.cloneDeep(groupsFormat.filter((item) => item.grpId === grpId)[0]);
    setGroupDetailInfo(selectedGroup.grpDetailInfo);
    setGroupMemberUsers(selectedGroup.grpMemberUser);
    setGroupNotMemberUsers(selectedGroup.grpNotMemberUser);
  };

  if (_.isEmpty(groupDetailInfo)) {
    ref.current?._instance.clearSelection();
  }

  return (
    <Panel title={'그룹 (' + groupsFormat.length + '개)'}>
      <DataGrid
        height={600}
        dataSource={groupsFormat}
        showBorders={true}
        onRowClick={handleRowClick}
        ref={ref}
      >
        <Selection mode="single" />
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
    </Panel>
  );
};

export default GroupDataGrid;
