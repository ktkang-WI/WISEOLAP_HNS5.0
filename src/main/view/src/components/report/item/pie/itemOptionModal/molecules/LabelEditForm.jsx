import localizedString from 'config/localization';
import {Form} from 'devextreme-react';
import {Item} from 'devextreme-react/form';
import React from 'react';

const LabelEditForm = ({selectedItem}, ref) => {
  return (
    <Form
      ref={ref}
      formData={_.cloneDeep(selectedItem.meta.labelEdit)}
    >
      <Item
        dataField='showTitle'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      ></Item>
      <Item
        dataField='format'
        editorType='dxSelectBox'
        editorOptions={{
          // 포멧형식 배열
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
export default React.forwardRef(LabelEditForm);
