import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  AsyncRule,
  EmptyItem,
  Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import {useContext} from 'react';
import localizedString from 'config/localization';
import {duplicateValidation} from 'components/config/utility/utility';

const GroupInfo = () => {
  // context
  const getContext = useContext(UserGroupContext);
  const [groupsFormat] = getContext.state.groupsFormat;
  const [groupDetailInfo] = getContext.state.groupDetailInfo;
  const groupDataGridRef = getContext.ref.groupDataGridRef;
  const groupInfoRef = getContext.ref.groupInfoRef;

  // selectBox DataSource
  const mode = ['ADMIN', 'VIEW'];

  const asyncValidation = (params) => {
    const selectedRow = groupDataGridRef.current._instance
        .getSelectedRowsData()[0];
    const invalidValues = groupsFormat
        .filter((row) => row.grpNm != selectedRow?.grpNm)
        .map((row) => row.grpNm);
    return duplicateValidation(params.value, invalidValues, groupInfoRef);
  };

  return (
    <Panel title={localizedString.groupInfo}>
      <Form
        formData={groupDetailInfo}
        ref={groupInfoRef}
        elementAttr={{
          class: 'group-info'
        }}
      >
        <EmptyItem
          dataField="grpId"
          editorOptions={{
            mode: 'number'
          }}
        >
        </EmptyItem>
        <SimpleItem
          dataField="grpNm"
        >
          <RequiredRule message={localizedString.validationGroupNm}/>
          <AsyncRule
            message={localizedString.validationDupleGrpNm}
            validationCallback={asyncValidation}
          />
          <Label>{localizedString.groupName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="grpDesc"
          editorType='dxTextArea'
        >
          <Label>{localizedString.description}</Label>
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
