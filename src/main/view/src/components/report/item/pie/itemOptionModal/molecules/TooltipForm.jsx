import localizedString from 'config/localization';
import Form, {Item} from 'devextreme-react/form';
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
          items: localizedString.formatItems
        }}
      ></Item>
      <Item
        dataField='unit'
        editorType='dxSelectBox'
        editorOptions={{
          items: ['Auto', 'Ones', 'Thousands', 'Milions', 'Bilions']
        }}
      >

      </Item>
      <Item
        dataField='customPrefix'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >

      </Item>
      <Item
        dataField='inputPrefix'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
      </Item>
      <Item
        dataField='customSuffix'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
      </Item>
      <Item
        dataField='ones'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
      </Item>
      <Item
        dataField='thousands'
        editorType='dxTextBox'
        editorOptions={{
          value: 'K'
        }}
      >
      </Item>
      <Item
        dataField='milions'
        editorType='dxTextBox'
        editorOptions={{
          value: 'M'
        }}
      >
      </Item>
      <Item
        dataField='bilions'
        editorType='dxTextBox'
        editorOptions={{
          value: 'B'
        }}
      >
      </Item>
      <Item
        dataField='degree'
        editorType='dxNumberBox'
      >
      </Item>
      <Item
        dataField='degreeOption'
        editorType='dxSelectBox'
        editorOptions={{
          items: localizedString.degreeOptions
        }}
      >
      </Item>
    </Form>
  );
};
export default React.forwardRef(TooltipForm);
