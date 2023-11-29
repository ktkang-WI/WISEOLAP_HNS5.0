import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import _ from 'lodash';

const ParameterInfoForm = ({dataSource, ...props}) => {
  const operationSource = [
    {name: 'IN', caption: 'In'},
    {name: 'NOT_IN', caption: 'Not In'},
    {name: 'EQUALS', caption: 'Equals'},
    {name: 'BETWEEN', caption: 'Between'}
  ];

  const dataTypeSource = [
    {name: 'STRING', caption: 'String'},
    {name: 'NUMBER', caption: 'Number'},
    {name: 'DATE', caption: 'Date'}
  ];

  const paramTypeSource = [
    {name: 'LIST', caption: localizedString.list},
    {name: 'INPUT', caption: localizedString.input},
    {name: 'CALENDAR', caption: localizedString.calendar}
  ];

  return (
    <Form
      labelMode='outside'
      formData={_.cloneDeep(dataSource)}
      readOnly={_.isEmpty(dataSource)}
      labelLocation='left'
      {...props}
    >
      <Item
        editorType='dxTextBox'
        dataField='name'
        editorOptions={{readOnly: true}}>
        <Label>{localizedString.parameterName} </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='caption'
      >
        <Label>{localizedString.parameterCaption}* </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='dataType'
        editorOptions={{
          dataSource: dataTypeSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.dataType}* </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='paramType'
        editorOptions={{
          dataSource: paramTypeSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.parameterType}* </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='operation'
        editorOptions={{
          dataSource: operationSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.conditionName}</Label>
      </Item>
      <Item editorType='dxCheckBox' dataField='useSearch'>
        <Label>{localizedString.useDataSearchOption} </Label>
      </Item>
    </Form>
  );
};

export default ParameterInfoForm;
