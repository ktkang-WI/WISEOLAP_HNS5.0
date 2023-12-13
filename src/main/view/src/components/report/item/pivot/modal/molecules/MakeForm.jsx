import {Form} from 'devextreme-react';
import {GroupItem, Item} from 'devextreme-react/form';
import React, {useState} from 'react';
import EmojiArr from './EmojiArr';

const MakeForm = ({formData, measureNames}, ref) => {
  console.log(formData);
  const [showField, setShowField] = useState(false);
  const validationRules = {
    valueFrom: [
      {type: 'required'}
    ],
    fieldName: [
      {type: 'required'}
    ],
    condition: [
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
      <GroupItem colCount={1}>
        <Item
          name='fieldName'
          dataField='fieldName'
          caption='데이터항목'
          editorType='dxSelectBox'
          editorOptions={{
            items: measureNames
          }}
          validationRules={validationRules.fieldName}>
        </Item>
        <Item
          name='condition'
          dataField='condition'
          caption='조건 유형'
          editorType='dxSelectBox'
          editorOptions={{
            items: ['=', '<>', '>', '>=', '<', '<=', 'Between']
          }}
          validationRules={validationRules.condition}>
        </Item>
        <Item
          name='backgroundColor'
          dataField='backgroundColor'
          editorType='dxColorBox'>
        </Item>
        <Item
          name='fontColor'
          dataField='fontColor'
          editorType='dxColorBox'>
        </Item>
        <Item
          name='valueFrom'
          dataField='valueFrom'
          editorType='dxTextBox'
          validationRules={validationRules.valueFrom}>
        </Item>
        {showField && <Item // Between 일 때만 보임.
          name='valueTo'
          dataField='valueTo'
          editorType='dxTextBox'
          validationRules={showField && validationRules.valueFrom}>
        </Item>}
        <Item
          name='emojiList'
          dataField='emojiList'
          editorType='dxSelectBox'
          editorOptions={{
            items: EmojiArr
          }}>
        </Item>
        <Item
          name='applyCell'
          dataField='applyCell'
          editorType='dxCheckBox'
          editorOptions={{
            elementAttr: {check: true}
          }}>
        </Item>
        <Item
          name='applyTotal'
          dataField='applyTotal'
          editorType='dxCheckBox'>
        </Item>
        <Item
          name='applyGrandTotal'
          dataField='applyGrandTotal'
          editorType='dxCheckBox'>
        </Item>
      </GroupItem>
    </Form>
  );
};
export default React.forwardRef(MakeForm);
