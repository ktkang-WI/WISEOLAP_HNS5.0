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
      <Item editorType='dxTextBox' dataField='dsNm'>
        <Label>데이터 원본 명: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='ip'>
        <Label>서버 주소(명): </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbNm'>
        <Label>DB 명: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='dbmsType'>
        <Label>DB 유형: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='port' visible={!compact}>
        <Label>Port: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='ownerNm' visible={!compact}>
        <Label>소유자: </Label>
      </Item>
      <Item editorType='dxTextBox' dataField='userId' visible={!compact}>
        <Label>접속 ID: </Label>
      </Item>
      <Item editorType='dxTextArea' dataField='dsDesc' visible={!compact}>
        <Label>설명: </Label>
      </Item>
    </Form>
  );
};

export default DataSourceInfoForm;
