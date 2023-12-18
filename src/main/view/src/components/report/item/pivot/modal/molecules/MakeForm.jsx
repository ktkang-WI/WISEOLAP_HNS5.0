import {Form, Template} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import localizedString from '../../../../../../config/localization';
import React, {useState} from 'react';
import EmojiArr from './EmojiArr';

const MakeForm = ({formData, measureNames}, ref) => {
  const [showField, setShowField] = useState(false);
  // console.log(formData);
  const [selectedIcon, setSelectedIcon] = useState('');
  // let selectedItcon = {};

  const emojiSelectBox = (e) => {
    if (e !== '') {
      return (
        <img
          alt='Custom icon'
          src={e}
          className='custom-icon'
        />
      );
    }
    return (
      <div className='dx-dropdowneditor-icon'></div>
    );
  };

  const validationRules = {
    validation: [
      {type: 'required'}
    ]
  };

  return (
    <Form
      formData={formData}
      ref={ref}
      onFieldDataChanged={(e) => {
        if (e.dataField === 'condition' && e.value === 'Between') {
          setShowField(true);
        } else if (e.dataField === 'condition' && e.value !== 'Between') {
          setShowField(false);
        }
      }}
    >
      <Item
        name='dataItem'
        dataField='dataItem'
        editorType='dxSelectBox'
        editorOptions={{
          items: measureNames
        }}
        validationRules={validationRules.validation}>
        <Label>{localizedString.dataItem}: </Label>
      </Item>
      <Item
        name='condition'
        dataField='condition'
        editorType='dxSelectBox'
        editorOptions={{
          items: ['=', '<>', '>', '>=', '<', '<=', 'Between']
        }}
        validationRules={validationRules.validation}>
        <Label>{localizedString.condition}: </Label>
      </Item>
      <Item
        name='backgroundColor'
        dataField='backgroundColor'
        editorType='dxColorBox'>
        <Label>{localizedString.backgroundColor}: </Label>
      </Item>
      <Item
        name='fontColor'
        dataField='fontColor'
        editorType='dxColorBox'>
        <Label>{localizedString.fontColor}: </Label>
      </Item>
      <Item
        name='valueFrom'
        dataField='valueFrom'
        editorType='dxTextBox'
        validationRules={validationRules.validation}>
        <Label>{localizedString.valueFrom}: </Label>
      </Item>
      {showField && <Item // show in Between.
        name='valueTo'
        dataField='valueTo'
        editorType='dxTextBox'
        validationRules={validationRules.validation}>
        <Label>{localizedString.valueTo}: </Label>
      </Item>}
      <Item
        name='emojiList'
        dataField='emojiList'
        editorType='dxSelectBox'
        editorOptions={{
          dataSource: EmojiArr,
          displayExpr: 'id',
          valueExpr: 'id',
          dropDownButtonTemplate: 'conditionalIcon',
          onSelectionChanged: (e) => {
            setSelectedIcon(e.selectedItem ? e.selectedItem.icon : '');
            // selectedItcon = e.selectedItem?.icon;
          }
        }}>
        <Template
          name="conditionalIcon"
          render={() => emojiSelectBox(selectedIcon)}
        />
        <Label>{localizedString.emojiList}: </Label>
      </Item>
      <Item
        name='applyCell'
        dataField='applyCell'
        editorType='dxCheckBox'
        editorOptions={{
          value: true
        }}>
        <Label>{localizedString.applyCell}: </Label>
      </Item>
      <Item
        name='applyTotal'
        dataField='applyTotal'
        editorType='dxCheckBox'
        editorOptions={{
          value: true
        }}>
        <Label>{localizedString.applyTotal}: </Label>
      </Item>
      <Item
        name='applyGrandTotal'
        dataField='applyGrandTotal'
        editorType='dxCheckBox'
        editorOptions={{
          value: true
        }}>
        <Label>{localizedString.applyGrandTotal}: </Label>
      </Item>
    </Form>
  );
};
export default React.forwardRef(MakeForm);
