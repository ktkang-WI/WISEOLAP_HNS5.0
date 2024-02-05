import React from 'react';
import localizedString from 'config/localization';
import Form, {Item, Label} from 'devextreme-react/form';
import _ from 'lodash';


const XAxisForm = ({selectedItem}, ref) => {
  const formData = _.cloneDeep(selectedItem.meta.xAxis);
  return (
    <Form
      ref={ref}
      formData={formData}
    >
      <Item
        dataField='useComma'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.numberSeperator}</Label>
      </Item>
      <Item
        dataField='customText'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.axisCutomText}</Label>
      </Item>
      <Item
        dataField='customText'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.axisCutomText}</Label>
      </Item>
    </Form>
  );
};

export default React.forwardRef(XAxisForm);
