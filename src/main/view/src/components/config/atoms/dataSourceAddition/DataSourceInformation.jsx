import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  GroupItem, Item, Label
} from 'devextreme-react/form';
import localizedString from 'config/localization';

const DataSourceInformation = ({row}) => {
  return (
    <Panel title={localizedString.dataSourceInfo}>
      <Form
        formData={row}
      >
        <GroupItem colCount={1}>
          <Item
            dataField="dsNm"
            editorType="dxTextBox"
          >
            <Label>{localizedString.dataSourceName}</Label>
          </Item>
          <Item
            dataField="ip"
            editorType="dxTextBox"
          >
            <Label>{localizedString.dbAddress}</Label>
          </Item>
          <Item
            dataField="dbNm"
            editorType="dxTextBox"
          >
            <Label>{localizedString.dbName}</Label>
          </Item>
          <Item
            dataField="dbmsType"
            editorType="dxSelectBox"
          >
            <Label>{localizedString.dbType}</Label>
          </Item>
          <Item
            dataField="ownerNm"
            editorType="dxTextBox"
          >
            <Label>{localizedString.owner}</Label>
          </Item>
          <Item
            dataField="port"
            editorType="dxTextBox"
          >
            <Label>{localizedString.port}</Label>
          </Item>
          <Item
            dataField="port"
            editorType="dxTextBox"
          >
            <Label>{'접속 ID'}</Label>
          </Item>
          <Item
            dataField="port"
            editorType="dxTextBox"
          >
            <Label>{'접속 암호'}</Label>
          </Item>
          <Item
            editorType="dxButton"
            editorOptions={{
              text: '연결 테스트'
            }}
          >
          </Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default DataSourceInformation;
