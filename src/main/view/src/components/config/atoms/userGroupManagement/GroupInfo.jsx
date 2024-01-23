import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';

const GroupInfo = () => {
  const getContext = useContext(UserGroupContext);
  const [groupDetailInfo] = getContext.state.groupDetailInfo;

  return (
    <Panel title='그룹 정보'>
      <Form
        formData={groupDetailInfo}
      >
        <GroupItem colCount={1}>
          <Item
            dataField="grpNm"
            caption="그룹명"></Item>
          <SimpleItem dataField="grpDesc" caption="설명">
            <TextArea
              height={100}
              width="100%"
            />
          </SimpleItem>
          <Item
            dataField="grpRunMode"
            caption="그룹 실행모드"
            editorType="dxSelectBox"></Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default GroupInfo;
