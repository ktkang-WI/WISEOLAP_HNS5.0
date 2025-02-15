import localizedString from 'config/localization';
import {styled} from 'styled-components';
import Form, {Item, Label} from 'devextreme-react/form';
import {useEffect, useState} from 'react';
import {formatValue, updateFomatType} from './FormatFunction';
import {formatType, unitType, precisionType}
  from 'components/report/item/util/formatDefaultElement';
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
  formRef,
  itemType = '',
  axisSetting = false
}) => {
  const [preview, setPreview] = useState(formatValue(formData));
  useEffect(() => {
    if (formRef.current) {
      Object.keys(formData).forEach((key) => {
        const e = {
          component: formRef.current.instance,
          value: formData[key],
          dataField: key
        };
        updateFomatType(e);
      });
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
            dataSource: formatType,
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
            dataSource: unitType,
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.digitUnit}: </Label>
      </Item>
      {itemType == 'chart' && axisSetting && <Item
        dataField='autoBreak'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{'스케일 브레이크 사용'}</Label>
      </Item>}
      {itemType == 'chart' && axisSetting && <Item
        dataField='hideNegativeNumber'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{'음수 값 숨김'}</Label>
      </Item>}
      {itemType == 'chart' && axisSetting && <Item
        dataField='axisStartToZero'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.yAsixStartPoint}</Label>
      </Item>}
      {itemType == 'chart' && axisSetting && <Item
        dataField='tick'
        editorType='dxTextBox'
      >
        <Label>{'간격'}</Label>
      </Item>}
      {itemType == 'chart' && axisSetting && <Item
        dataField='startValue'
        editorType='dxTextBox'
      >
        <Label>{'최솟값'}</Label>
      </Item>}
      {itemType == 'chart' && axisSetting && <Item
        dataField='endValue'
        editorType='dxTextBox'
      >
        <Label>{'최댓값'}</Label>
      </Item>}
      {axisSetting && <Item
        dataField='useAxis'
        editorType='dxCheckBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.yAxisMark}</Label>
      </Item>}
      {axisSetting && <Item
        dataField='customText'
        editorType='dxTextBox'
        editorOptions={{
        }}
      >
        <Label>{localizedString.axisCutomText}</Label>
      </Item>}
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
        <Label>{localizedString.precision}: </Label>
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        editorOptions={
          {
            dataSource: precisionType,
            valueExpr: 'value',
            displayExpr: 'caption'
          }
        }
      >
        <Label>{localizedString.precisionOption}: </Label>
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
          readOnly={true}
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
