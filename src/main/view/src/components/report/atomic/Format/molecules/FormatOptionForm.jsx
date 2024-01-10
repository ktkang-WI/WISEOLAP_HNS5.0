import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import localizedString from 'config/localization';
import {styled} from 'styled-components';
import Form, {Item, Label} from 'devextreme-react/form';

const FormatOptionForm = ({
  state,
  setState,
  handleCheckBoxValueChanged
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

  return (
    <Form
      labelMode='outside'
      labelLocation='left'
      formData={state.formatOptions}
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
          defaultValue={state.formatType}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              formatType: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='unit'
        editorType='dxSelectBox'
        disabled={state.formControls.unit}
      >
        <Label>{localizedString.digitUnit}: </Label>
        <SelectBox
          items={['Auto', 'Ones', 'Thousands', 'Millions', 'Billions']}
          defaultValue={state.unit}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              unit: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='suffixEnabled'
        editorType='dxCheckBox'
        disabled={state.formControls.suffixEnabled}
      >
        <Label>{localizedString.customSuffix}: </Label>
        <CheckBox
          value={state.suffixEnabled}
          onValueChanged={(e) => {
            handleCheckBoxValueChanged('suffixEnabled', e.value);
          }}/>
      </Item>
      <Item
        dataField='suffixO'
        editorType='dxTextBox'
        disabled={state.formControls.suffixO}
      >
        <Label>{localizedString.suffixO}: </Label>
        <TextBox
          defaultValue={state.suffixO}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              suffixO: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='suffixK'
        editorType='dxTextBox'
        disabled={state.formControls.suffixK}
      >
        <Label>{localizedString.suffixK}: </Label>
        <TextBox
          defaultValue={state.suffixK}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              suffixK: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='suffixM'
        editorType='dxTextBox'
        disabled={state.formControls.suffixM}
      >
        <Label>{localizedString.suffixM}: </Label>
        <TextBox
          defaultValue={state.suffixM}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              suffixM: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='suffixB'
        editorType='dxTextBox'
        disabled={state.formControls.suffixB}
      >
        <Label>{localizedString.suffixB}: </Label>
        <TextBox
          defaultValue={state.suffixB}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              suffixB: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='precision'
        editorType='dxNumberBox'
        disabled={state.formControls.precision}
      >
        <Label>{localizedString.decimalUnit}: </Label>
        <NumberBox
          step={1}
          min={0}
          max={5}
          format="#"
          showSpinButtons={true}
          defaultValue={state.precision}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              precision: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='precisionType'
        editorType='dxSelectBox'
        disabled={state.formControls.precisionType}
      >
        <Label>{localizedString.roundUnit}: </Label>
        <SelectBox
          items={['반올림', '올림', '버림']}
          defaultValue={state.precisionType}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              precisionType: e.value
            }));
          }}
        />
      </Item>
      <Item
        dataField='useDigitSeparator'
        editorType='dxCheckBox'
        disabled={state.formControls.useDigitSeparator}
      >
        <Label>{localizedString.includesGroupDistinction}: </Label>
        <CheckBox
          defaultValue={state.useDigitSeparator}
          onValueChanged={(e) => {
            setState((prevState) => ({
              ...prevState,
              useDigitSeparator: e.value
            }));
          }}
        />
      </Item>
      <Item
        editorType='dxTextArea'
        disabled={true}
      >
        <Preview
          defaultValue={state.formattedValue}
          readOnly
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
