import Form, {Item, Label} from 'devextreme-react/form';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import {
  selectCurrentDataField,
  selectCurrentDataFieldOption
} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';

const theme = getTheme();

const TopBottomForm = ({formData}) => {
  const dataField = useSelector(selectCurrentDataField);
  const dataFieldOption = useSelector(selectCurrentDataFieldOption);

  const measures = [];

  // TODO: 추후 데이터 그리드 추가 필요
  for (const id in dataFieldOption) {
    if (dataFieldOption[id].type == 'MEA') {
      measures.push(...dataField[id]);
    } else if (dataFieldOption[id].type == 'ANY') {
      measures.push(...dataField[id].filter(
          (field) => field.type == 'MEA'));
    }
  }

  const topBottomTypes = ['TOP', 'BOTTOM'];

  return (
    <Form
      labelMode='outside'
      labelLocation='top'
      formData={formData}
    >
      <Item
        editorType='dxSelectBox'
        dataField='target'
        isRequired={true}
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          dataSource: measures,
          displayExpr: 'caption',
          valueExpr: 'fieldId'
        }}
      >
        <Label>
          {localizedString.dataItem}
        </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='type'
        isRequired={true}
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          dataSource: topBottomTypes
        }}
      >
        <Label>
          {localizedString.topBottomForm.topBottomType}
        </Label>
      </Item>
      <Item
        isRequired={true}
        editorType='dxNumberBox'
        dataField='count'
      >
        <Label>
          {localizedString.topBottomForm.count}
        </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='percentage'
      >
        <Label>
          {localizedString.topBottomForm.percentage}
        </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='others'
      >
        <Label>
          {localizedString.topBottomForm.others}
        </Label>
      </Item>
    </Form>
  );
};

export default TopBottomForm;
