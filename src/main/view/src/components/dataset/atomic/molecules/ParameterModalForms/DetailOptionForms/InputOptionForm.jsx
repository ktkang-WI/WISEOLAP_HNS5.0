import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';

const InputOptionForm = ({param, onFieldDataChanged, ...props}) => {
  const isBetween = param.operation == 'BETWEEN';

  const formData = _.cloneDeep(param);
  return (
    <Form
      labelMode='outside'
      formData={formData}
      labelLocation='left'
      colCount={2}
      onFieldDataChanged={onFieldDataChanged}
      {...props}
    >
      <Item
        colSpan={isBetween ? 1 : 2}
        editorType='dxTextArea'
        dataField='defaultValue[0]'
        editorOptions={{
          height: 250
        }}
      >
        <Label>{localizedString.defaultParameter +
        (isBetween? ' FROM' : '')}</Label>
      </Item>
      {
        isBetween &&
        <Item
          editorType='dxTextArea'
          dataField='defaultValue[1]'
          editorOptions={{
            height: 250,
            value: formData.defaultValue[1]
          }}
          labelMode='none'
        >
          <Label>{localizedString.defaultParameter} TO</Label>
        </Item>
      }
      <Item
        editorType='dxCheckBox'
        dataField='defaultValueUseSql'
      >
        <Label>{localizedString.defaultValueUseSql}</Label>
      </Item>
      <Item
        colSpan={1}
        editorType='dxTextBox'
        dataField='exceptionValue'
      >
        <Label>{localizedString.exceptionValue}*</Label>
      </Item>
    </Form>
  );
};

export default InputOptionForm;
