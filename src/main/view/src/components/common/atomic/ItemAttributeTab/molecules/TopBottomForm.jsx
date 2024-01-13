import Form, {Item, Label} from 'devextreme-react/form';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';

const theme = getTheme();

const TopBottomForm = ({formData}) => {
  const dataField = useSelector(selectCurrentDataField);
  const measures = dataField.measure;
  const dimensions = dataField.row.concat(dataField.column);
  const topBottomTypes = ['TOP', 'BOTTOM'];

  return (
    <Form
      labelMode='outside'
      labelLocation='top'
      formData={formData}
      readOnly={_.isEmpty(formData)}
      // ref={formRef}
    >
      <Item
        editorType='dxSelectBox'
        dataField='dataFieldId'
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          dataSource: measures,
          displayExpr: 'caption',
          valueExpr: 'fieldId'
        }}
      >
        <Label>
          {localizedString.dataItem}*
        </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='applyFieldId'
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          dataSource: dimensions,
          displayExpr: 'caption',
          valueExpr: 'fieldId'
        }}
      >
        <Label>
          {'적용 항목'}*
        </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='topBottomType'
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          dataSource: topBottomTypes
        }}
      >
        <Label>
          {'Top/Bottom 구분'}*
        </Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='topBottomCount'
      >
        <Label>
          {'Top/Bottom 개수'}*
        </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='isPercent'
      >
        <Label>
          {'% 적용'}
        </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='isShowOthers'
      >
        <Label>
          {'Top/Bottom 값 이외의 항목 기타로 표시'}
        </Label>
      </Item>
    </Form>
  );
};

export default TopBottomForm;
