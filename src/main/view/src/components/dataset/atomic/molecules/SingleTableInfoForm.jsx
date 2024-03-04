import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';

const SingleTableInfoForm = ({selectedDataSource, compact=false, ...props}) => {
  return (
    <Form
      labelMode='outside'
      formData={selectedDataSource}
      readOnly={true}
      labelLocation='left'
      {...props}
    >
      <Item editorType='dxTextBox' dataField='dsType'>
        <Label>{localizedString.dataSourceType}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='tableNm'>
        <Label>{localizedString.tableName}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dsNm'>
        <Label>{localizedString.dataSourceName}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbAddress'>
        <Label>{localizedString.dbAddress}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbNm'>
        <Label>{localizedString.dbName}: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbmsType'>
        <Label>{localizedString.dbType}: </Label>
      </Item>
    </Form>
  );
};

export default SingleTableInfoForm;
