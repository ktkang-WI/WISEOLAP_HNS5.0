import localizedString from 'config/localization';
import {styled} from 'styled-components';
import Form, {Item, Label} from 'devextreme-react/form';
import {useEffect, useState} from 'react';
import {formatValue, updateFomatType} from './FormatFunction';

const Preview = styled.textarea`
background-color: lightgray;
border: 1px solid #ccc;
resize: none;
width: 100%;
height: 70px;
padding: 5px;
font-size: 40px;
text-align: center;
`;

const FormatOptionForm = ({
  formData,
  formRef
}) => {
  const [preview, setPreview] = useState(formatValue(formData));
  useEffect(() => {
    if (formRef.current) {
      const e = {
        component: formRef.current.instance,
        value: formData.formatType
      };

      updateFomatType(e);
    }
  }, [formRef]);

  return (
    <Form
      labelMode='outside'
      labelLocation='left'
      formData={formData}
      ref={formRef}
      onFieldDataChanged={(e) => {
        const updatedFormData = {
          ...formData,
          [e.dataField]: e.value
        };
        updatedFormData.suffix = {
          O: updatedFormData.suffixO,
          K: updatedFormData.suffixK,
          M: updatedFormData.suffixM,
          B: updatedFormData.suffixB
        };
        setPreview(formatValue(updatedFormData));
        updateFomatType(e);
      }}
    >
      <Item
        editorType='dxSelectBox'
        dataField='formatType'
        editorOptions={
          {
            dataSource: [
              {value: 'Auto', caption: 'Auto'},
              {value: 'General', caption: 'General'},
              {value: 'Number', caption: 'Number'},
              {value: 'Currency', caption: 'Currency'},
              {value: 'Scientific', caption: 'Scientific'},
              {value: 'Percent', caption: 'Percent'}
            ],
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.formatUnit}: </Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='unit'
        editorOptions={
          {
            dataSource: [
              {value: 'Auto', caption: 'Auto'},
              {value: 'Ones', caption: 'Ones'},
              {value: 'Thousands', caption: 'Thousands'},
              {value: 'Millions', caption: 'Millions'},
              {value: 'Billions', caption: 'Billions'}
            ],
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.digitUnit}: </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='suffixEnabled'
      >
        <Label>{localizedString.customSuffix}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixO'
        className='suffixO'
      >
        <Label>{localizedString.suffixO}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixK'
        className='suffixK'
      >
        <Label>{localizedString.suffixK}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixM'
        className='suffixM'
      >
        <Label>{localizedString.suffixM}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixB'
        className='suffixB'
      >
        <Label>{localizedString.suffixB}: </Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='precision'
        editorOptions={
          {
            value: formData.precision
          }
        }
      >
        <Label>{localizedString.precsion}: </Label>
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        editorOptions={
          {
            dataSource: [
              {value: 'round', caption: localizedString.round},
              {value: 'ceil', caption: localizedString.ceil},
              {value: 'floor', caption: localizedString.floor}
            ],
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.precsionOption}: </Label>
      </Item>
      <Item
        dataField='useDigitSeparator'
        editorType='dxCheckBox'
        editorOptions={
          {
            value: formData.useDigitSeparator
          }
        }
      >
        <Label>{localizedString.digitSeparator}: </Label>
      </Item>
      <Item
        editorType='dxTextArea'
        disabled={true}
      >
        <Preview
          value={preview}
          readOnly
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
