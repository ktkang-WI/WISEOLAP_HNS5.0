import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';

const DataSourceInfoForm = ({selectedDataSource, compact=false, ...props}) => {
  return (
    <Form
      labelMode='outside'
      formData={selectedDataSource}
      readOnly={true}
      labelLocation='left'
      {...props}
    >
      <Item editorType='dxTextBox' dataField='dsNm'>
        <Label>{localizedString.dataSourceName}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='ip'>
        <Label>{localizedString.dbAddress}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbNm'>
        <Label>{localizedString.dbName}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbmsType'>
        <Label>{localizedString.dbType}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='port' visible={!compact}>
        <Label>Port: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='ownerNm' visible={!compact}>
        <Label>{localizedString.owner}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='userId' visible={!compact}>
        <Label>{localizedString.dbId}: </Label>
      </Item>
      <Item editorType='dxTextArea' dataField='dsDesc' visible={!compact}>
        <Label>{localizedString.description}: </Label>
      </Item>
    </Form>
  );
};

export default DataSourceInfoForm;
