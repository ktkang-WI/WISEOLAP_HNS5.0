import localizedString from 'config/localization';
import Form, {Item, Label} from 'devextreme-react/form';
import _ from 'lodash';
import React from 'react';

const TooltipForm = ({selectedItem}, ref) => {
  return (
    <Form
      ref={ref}
      formData={_.cloneDeep(selectedItem.meta.tooltip)}
    >
      <Item
        dataField='format'
        editorType='dxSelectBox'
        editorOptions={{
          items: localizedString.formatItems,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.formatType}</Label>
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
        dataField='customPrefix'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.customPrefix}</Label>
      </Item>
      <Item
        dataField='inputPrefix'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.inputPrefix}</Label>
      </Item>
      <Item
        dataField='suffixEnabled'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.customSuffix}</Label>
      </Item>
      <Item
        dataField='suffixO'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.ones}</Label>
      </Item>
      <Item
        dataField='suffixK'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.thousands}</Label>
      </Item>
      <Item
        dataField='suffixM'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.millions}</Label>
      </Item>
      <Item
        dataField='suffixB'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.billions}</Label>
      </Item>
      <Item
        dataField='precision'
        editorType='dxNumberBox'
      >
        <Label>{localizedString.precision}</Label>
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        editorOptions={{
          dataSource: localizedString.precisionOptions,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.precisionOption}</Label>
      </Item>
    </Form>
  );
};
export default React.forwardRef(TooltipForm);
