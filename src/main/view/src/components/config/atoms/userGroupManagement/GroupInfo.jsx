import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';
import localizedString from 'config/localization';

const GroupInfo = () => {
  const getContext = useContext(UserGroupContext);
  const [groupDetailInfo] = getContext.state.groupDetailInfo;

  return (
    <Panel title={localizedString.groupInfo}>
      <Form
        formData={groupDetailInfo}
      >
        <GroupItem colCount={1}>
          <Item
            dataField="grpNm"
            caption={localizedString.groupName}></Item>
          <SimpleItem dataField="grpDesc" caption={localizedString.description}>
            <TextArea
              height={100}
              width="100%"
            />
          </SimpleItem>
          <Item
            dataField="grpRunMode"
            caption={localizedString.groupRunMode}
            editorType="dxSelectBox"></Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default GroupInfo;
