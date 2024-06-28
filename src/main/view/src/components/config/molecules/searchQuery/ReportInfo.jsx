// eslint-disable-next-line max-len
import Panel from 'components/config/organisms/userGroupManagement/common/Panel';
import {Form} from 'devextreme-react';
import {SimpleItem, Label} from 'devextreme-react/form';

import React from 'react';

const ReportInfo = ({itemData}) => {
  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={itemData}
      >
        <SimpleItem
          dataField="id"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportId}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="name"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="type"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportType}</Label>
        </SimpleItem>
      </Form>
    </Panel>
  );
};

export default React.memo(ReportInfo);
