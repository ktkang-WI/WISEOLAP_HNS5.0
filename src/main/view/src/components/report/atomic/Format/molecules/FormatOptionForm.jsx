import localizedString from 'config/localization';
import {styled} from 'styled-components';
import Form, {Item, Label} from 'devextreme-react/form';
import {useState} from 'react';
import {formatValue, updateFomatType, updateSuffix} from './FormatFunction';

const FormatOptionForm = ({
  Formdata,
  Formref
}) => {
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
  const [preview, setPreview] = useState(formatValue(Formdata));

  return (
    <Form
      labelMode='outside'
      labelLocation='left'
      formData={Formdata}
      ref={Formref}
      onFieldDataChanged={(e) => {
        const updatedFormData = {
          ...Formdata,
          [e.dataField]: e.value
        };
        updatedFormData.suffix = {
          O: updatedFormData.suffixO,
          K: updatedFormData.suffixK,
          M: updatedFormData.suffixM,
          B: updatedFormData.suffixB
        };
        setPreview(formatValue(updatedFormData));
        if (e.dataField === 'formatType') {
          updateFomatType(e, e.value);
        } else if (e.dataField === 'suffixEnabled') {
          updateSuffix(e, e.value);
        }
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
      >
        <Label>{localizedString.suffixO}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixK'
      >
        <Label>{localizedString.suffixK}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixM'
      >
        <Label>{localizedString.suffixM}: </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='suffixB'
      >
        <Label>{localizedString.suffixB}: </Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='precision'
        editorOptions={
          {
            value: Formdata.precision
          }
        }
      >
        <Label>{localizedString.decimalUnit}: </Label>
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        editorOptions={
          {
            dataSource: [
              {value: '반올림', caption: '반올림'},
              {value: '올림', caption: '올림'},
              {value: '버림', caption: '버림'}
            ],
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.roundUnit}: </Label>
      </Item>
      <Item
        dataField='useDigitSeparator'
        editorType='dxCheckBox'
        editorOptions={
          {
            value: Formdata.useDigitSeparator
          }
        }
      >
        <Label>{localizedString.includesGroupDistinction}: </Label>
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
