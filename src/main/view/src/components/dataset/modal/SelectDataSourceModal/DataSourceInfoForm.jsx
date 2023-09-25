import Form, {Item, Label} from 'devextreme-react/form';

const DataSourceInfoForm = ({selectedDataSource, compact=false, ...props}) => {
  return (
    <Form
      labelMode='outside'
      formData={selectedDataSource}
      readOnly={true}
      labelLocation='left'
      {...props}
    >
      <Item editorType='dxTextBox' dataField='DS_NM'>
        <Label>데이터 원본 명: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='IP'>
        <Label>서버 주소(명): </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='DB_NM'>
        <Label>DB 명: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='DBMS_TYPE'>
        <Label>DB 유형: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='PORT' visible={!compact}>
        <Label>Port: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='OWNER_NM' visible={!compact}>
        <Label>소유자: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='USER_ID' visible={!compact}>
        <Label>접속 ID: </Label>
      </Item>
      <Item editorType='dxTextArea' dataField='DS_DESC' visible={!compact}>
        <Label>설명: </Label>
      </Item>
    </Form>
  );
};

export default DataSourceInfoForm;
