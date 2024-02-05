import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  GroupItem, Item, Label
} from 'devextreme-react/form';
import localizedString from 'config/localization';

const ReportInformation = () => {
  const reportInformation = [];

  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={reportInformation}
      >
        <GroupItem colCount={1}>
          <Item
            dataField="reportId"
            editorType="dxTextBox"
          >
            <Label>{localizedString.reportId}</Label>
          </Item>
          <Item
            dataField="reportNm"
            editorType="dxTextBox"
          >
            <Label>{localizedString.reportName}</Label>
          </Item>
          <Item
            dataField="reportSubNm"
            editorType="dxTextBox"
          >
            <Label>{localizedString.reportSubName}</Label>
          </Item>
          <Item
            dataField="reportType"
            editorType="dxTextBox"
          >
            <Label>{localizedString.reportType}</Label>
          </Item>
          <Item
            dataField="folderManagement"
            editorType="dxTextBox"
          >
            <Label>{localizedString.folderManagement}</Label>
          </Item>
          <Item
            dataField="publisher"
            editorType="dxTextBox"
          >
            <Label>{localizedString.publisher}</Label>
          </Item>
          <Item
            dataField="registerDate"
            editorType="dxTextBox"
          >
            <Label>{localizedString.RegisterDate}</Label>
          </Item>
          <Item
            dataField="annotation"
            editorType="dxTextBox"
          >
            <Label>{localizedString.annotation}</Label>
          </Item>
          <Item
            dataField="order"
            editorType="dxTextBox"
          >
            <Label>{localizedString.order}</Label>
          </Item>
          <Item
            dataField="order"
            editorType="dxTextBox"
          >
            <TextArea
              height={100}
              width="100%"
            />
            <Label>{localizedString.description}</Label>
          </Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default ReportInformation;
