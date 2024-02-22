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
        dataField='xAxisMark'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.xAxisMark}</Label>
      </Item>
      <Item
        dataField='axisCutomText'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.axisCutomText}</Label>
      </Item>
      <Item
        dataField='xAxisInclination'
        editorType='dxRadioGroup'
        editorOptions={{
          items: [0, 45, 90],
          layout: 'horizontal'
        }}
      >
        <Label>{localizedString.inclination}</Label>
      </Item>
    </Form>
  );
};

export default React.forwardRef(XAxisForm);
