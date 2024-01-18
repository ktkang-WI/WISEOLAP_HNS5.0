import React from 'react';
import localizedString from 'config/localization';
import Form, {Item, Label} from 'devextreme-react/form';
import _ from 'lodash';

const YAxisExtraAxisForm = ({selectedItem}, ref) => {
  const sampleNum = 1234567890;
  const axisNumberFormatList =
    ['Auto', 'General', 'Number', 'Currency', 'Scientific', 'Percent'];

  const formData = _.cloneDeep(selectedItem.meta.yAxis);
  formData.sampleNum = sampleNum;

  return (
    <Form
      ref={ref}
      formData={formData}
    >
      <Item
        dataField='format'
        editorType='dxSelectBox'
        editorOptions={{
          items: axisNumberFormatList,
          onValueChanged: (e) => {
            console.log(e);
            console.log(ref);
          }
        }}
      >
        <Label>{localizedString.axisNumberFormat}</Label>
      </Item>
      <Item
        dataField='unit'
        editorType='dxSelectBox'
        editorOptions={{
          items: ['Auto', 'Ones', 'Thousands', 'Millions', 'Billions']
        }}
      >
        <Label>{localizedString.unit}</Label>
      </Item>
      <Item
        dataField='useShowZero'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.formatZeroMark}</Label>
      </Item>
      <Item
        dataField='useYxAxis'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.yAxisMark}</Label>
      </Item>
      <Item
        dataField='customText'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.axisCutomText}</Label>
      </Item>
      <Item
        dataField='customSuffix'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.customSuffix}</Label>
      </Item>
      <Item
        dataField='ones'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.ones}</Label>
      </Item>
      <Item
        dataField='thousands'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.thousands}</Label>
      </Item>
      <Item
        dataField='millions'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.millions}</Label>
      </Item>
      <Item
        dataField='billions'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.bilions}</Label>
      </Item>
      <Item
        dataField='decimalPoint'
        editorType='dxNumberBox'
      >
        <Label>{localizedString.degree}</Label>
      </Item>
      <Item
        dataField='round'
        editorType='dxSelectBox'
        editorOptions={{
          dataSource: localizedString.degreeOptions,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.degreeOption}</Label>
      </Item>
      <Item
        dataField='useComma'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.numberSeperator}</Label>
      </Item>
      <Item
        dataField='sampleNum'
        editorType='dxTextBox'
        disabled={true}
        editorOptions={{
        }}
      >
        <Label>{localizedString.NumberPreview}</Label>
      </Item>
    </Form>
  );
};

export default React.forwardRef(YAxisExtraAxisForm);
