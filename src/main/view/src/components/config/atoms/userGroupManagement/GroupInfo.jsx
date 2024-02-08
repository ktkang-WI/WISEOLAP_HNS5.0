import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';
import localizedString from 'config/localization';

const GroupInfo = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [groupDetailInfo] = getContext.state.groupDetailInfo;
  const groupInfoRef = getContext.ref.groupInfoRef;

  // selectBox DataSource
  const mode = ['ADMIN', 'VIEW'];

  return (
    <Panel title={localizedString.groupInfo}>
      <Form
        formData={groupDetailInfo}
        ref={groupInfoRef}
      >
        <SimpleItem
          dataField="grpNm"
        >
          <RequiredRule message={localizedString.validationGroupNm}/>
          <Label>{localizedString.groupName}</Label>
        </SimpleItem>
        <SimpleItem dataField="grpDesc">
          <Label>{localizedString.description}</Label>
          <TextArea
            height={100}
            width="100%"
          />
        </SimpleItem>
        <SimpleItem
          dataField="grpRunMode"
          editorType="dxSelectBox"
          editorOptions={{
            dataSource: mode
          }}
        >
          <RequiredRule message={localizedString.validationGroupRunMode}/>
          <Label>{localizedString.groupRunMode}</Label>
        </SimpleItem>
      </Form>
    </Panel>
  );
};

export default GroupInfo;
