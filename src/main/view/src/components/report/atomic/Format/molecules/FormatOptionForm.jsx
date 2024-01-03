import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import localizedString from 'config/localization';
import {styled} from 'styled-components';
import Form, {Item, Label} from 'devextreme-react/form';

const FormatOptionForm = ({
  formatOptions,
  formatType,
  unit,
  precision,
  precisionType,
  suffixEnabled,
  checkBoxValue,
  suffixO,
  suffixK,
  suffixM,
  suffixB,
  useDigitSeparator,
  setFormatType,
  setUnit,
  handleCheckBoxValueChanged,
  setSuffixO,
  setSuffixK,
  setSuffixM,
  setSuffixB,
  setPrecision,
  setPrecisionType,
  setUseDigitSeparator,
  formattedValue,
  formControls}) => {
  const PreView = styled.textarea`
  background-color: lightgray;
  border: 1px solid #ccc;
  resize: none;
  width: 100%;
  height: 70px;
  padding: 5px;
  font-size: 40px;
  text-align: center;
  `;

  return (
    <Form
      labelMode='outside'
      labelLocation='left'
      formData={formatOptions}
    >
      <Item
        dataField='formatType'
        editorType='dxSelectBox'
      >
        <Label>{localizedString.formatUnit}: </Label>
        <SelectBox
          items={
            [
              'Auto',
              'General',
              'Number',
              'Currency',
              'Scientific',
              'Percent'
            ]
          }
          defaultValue={formatType}
          onValueChanged={(e) => setFormatType(e.value)}
        />
      </Item>
      <Item
        dataField='unit'
        editorType='dxSelectBox'
        disabled={formControls.unit}
      >
        <Label>{localizedString.digitUnit}: </Label>
        <SelectBox
          items={['Auto', 'Ones', 'Thousands', 'Millions', 'Billions']}
          defaultValue={unit}
          onValueChanged={(e) => setUnit(e.value)}
        />
      </Item>
      <Item
        dataField='suffixEnabled'
        editorType='dxCheckBox'
        disabled={formControls.suffixEnabled}
      >
        <Label>{localizedString.customSuffix}: </Label>
        <CheckBox
          value={suffixEnabled}
          onValueChanged={
            (e) => handleCheckBoxValueChanged('suffixEnabled', e.value)}/>
      </Item>
      <Item
        dataField='suffixO'
        editorType='dxTextBox'
        disabled={!suffixEnabled || !checkBoxValue}
      >
        <Label>{localizedString.suffixO}: </Label>
        <TextBox
          defaultValue={suffixO}
          onValueChanged={(e) => setSuffixO(e.value)}
        />
      </Item>
      <Item
        dataField='suffixK'
        editorType='dxTextBox'
        disabled={!suffixEnabled || !checkBoxValue}
      >
        <Label>{localizedString.suffixK}: </Label>
        <TextBox
          defaultValue={suffixK}
          onValueChanged={(e) => setSuffixK(e.value)}
        />
      </Item>
      <Item
        dataField='suffixM'
        editorType='dxTextBox'
        disabled={!suffixEnabled || !checkBoxValue}
      >
        <Label>{localizedString.suffixM}: </Label>
        <TextBox
          defaultValue={suffixM}
          onValueChanged={(e) => setSuffixM(e.value)}
        />
      </Item>
      <Item
        dataField='suffixB'
        editorType='dxTextBox'
        disabled={!suffixEnabled || !checkBoxValue}
      >
        <Label>{localizedString.suffixB}: </Label>
        <TextBox
          defaultValue={suffixB}
          onValueChanged={(e) => setSuffixB(e.value)}
        />
      </Item>
      <Item
        dataField='precision'
        editorType='dxNumberBox'
        disabled={formControls.precision}
      >
        <Label>{localizedString.decimalUnit}: </Label>
        <NumberBox
          step={1}
          min={0}
          max={5}
          format="#"
          showSpinButtons={true}
          defaultValue={precision}
          onValueChanged={(e) => setPrecision(e.value)}
        />
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        disabled={formControls.precisionType}
      >
        <Label>{localizedString.roundUnit}: </Label>
        <SelectBox
          items={['반올림', '올림', '버림']}
          defaultValue={precisionType}
          onValueChanged={(e) => setPrecisionType(e.value)}
        />
      </Item>
      <Item
        dataField='useDigitSeparator'
        editorType='dxCheckBox'
        disabled={formControls.useDigitSeparator}
      >
        <Label>{localizedString.includesGroupDistinction}: </Label>
        <CheckBox
          defaultValue={useDigitSeparator}
          onValueChanged={(e) => setUseDigitSeparator(e.value)}
        />
      </Item>
      <Item
        editorType='dxTextArea'
        disabled={true}
      >
        <PreView
          defaultValue={formattedValue}
          readOnly
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
