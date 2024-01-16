import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import {Button} from 'devextreme-react';
import {useContext} from 'react';
import {GroupManagementContext}
  from 'components/config/molecules/userGroupManagement/GroupManagement';

const GroupMember = () => {
  const getContext = useContext(GroupManagementContext);
  const [groupMemberUsers] = getContext.state.groupMemberUsers;
  const [groupNotMemberUsers] = getContext.state.groupNotMemberUsers;

  return (
    <Wrapper display='flex'>
      <Wrapper>
        <Panel title='그룹소속사용자'>
          <DataGrid
            height={263}
            dataSource={groupMemberUsers}
            showBorders={true}
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
          </DataGrid>
        </Panel>
      </Wrapper>
      <Wrapper size='20px' display='flex'>
        <Wrapper display='flex' direction='column' center='center'>
          <Button height={30}>&#8592;</Button>
          <Button height={30}>&#8594;</Button>
        </Wrapper>
      </Wrapper>
      <Wrapper>
        <Panel title='사용자목록'>
          <DataGrid
            height={263}
            dataSource={groupNotMemberUsers}
            showBorders={true}
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
          </DataGrid>
        </Panel>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupMember;
