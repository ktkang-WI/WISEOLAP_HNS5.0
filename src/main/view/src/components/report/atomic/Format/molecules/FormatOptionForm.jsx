import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {useState, useEffect} from 'react';
import {styled} from 'styled-components';
import NumberFormatUtility from 'components/utils/NumberFormatUtility';

const FormatOptionForm = ({formatOptions}) => {
  const prefix = undefined;

  const formatValue = (options) => {
    const value = 1234567890.123;
    console.log('Options inside formatValue:', options);
    const formatted = NumberFormatUtility.formatNumber(
        value,
        options.formatType,
        options.unit,
        options.precision,
        options.useDigitSeparator,
        prefix,
        options.suffix,
        options.suffixEnabled,
        options.precisionType
    );

    return formatted;
  };
  const [suffixEnabled, setSuffixEnabled] = useState(
      formatOptions.suffixEnabled || false
  );
  const [formatType, setFormatType] = useState(
      formatOptions.formatType || 'Number'
  );
  const [unit, setUnit] = useState(
      formatOptions.unit || 'Ones'
  );
  const [precision, setPrecision] = useState(formatOptions.precision || 0);
  const [precisionType, setPrecisionType] = useState(
      formatOptions.precisionType || '반올림'
  );
  const [useDigitSeparator, setUseDigitSeparator] = useState(
      formatOptions.useDigitSeparator || false
  );
  const [suffixO, setSuffixO] = useState(formatOptions.suffix.O || '');
  const [suffixK, setSuffixK] = useState(formatOptions.suffix.K || '천');
  const [suffixM, setSuffixM] = useState(formatOptions.suffix.M || '백만');
  const [suffixB, setSuffixB] = useState(formatOptions.suffix.B || '십억');
  const [formattedValue, setFormattedValue] = useState(
      formatValue({
        formatType,
        unit,
        precision,
        precisionType,
        useDigitSeparator,
        prefix,
        suffix: {O: suffixO, K: suffixK, M: suffixM, B: suffixB},
        suffixEnabled
      })
  );
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const updateFormControls = () => {
    //
    const isAutoOrGeneral = formatType === 'Auto' || formatType === 'General';
    //
    const isNumberOrCurrency =
      formatType === 'Number' || formatType === 'Currency';
    //
    const isScientificOrPercent =
      formatType === 'Scientific' || formatType === 'Percent';
    //
    const isSuffixEnabled = suffixEnabled;

    const updatedControls = {
      unit: isNumberOrCurrency ? false : true,
      suffixEnabled: isNumberOrCurrency ? false : true,
      suffixO:
        isNumberOrCurrency && isSuffixEnabled && checkBoxValue ? false : true,
      suffixK:
        isNumberOrCurrency && isSuffixEnabled && checkBoxValue ? false : true,
      suffixM:
        isNumberOrCurrency && isSuffixEnabled && checkBoxValue ? false : true,
      suffixB:
        isNumberOrCurrency && isSuffixEnabled && checkBoxValue ? false : true,
      precision:
        isScientificOrPercent ? false : isNumberOrCurrency ? false : true,
      precisionType:
        isScientificOrPercent ? false : isNumberOrCurrency ? false : true,
      useDigitSeparator:
        isAutoOrGeneral ? true : isScientificOrPercent ? true : false
    };

    setFormControls(updatedControls);
  };

  useEffect(() => {
    updateFormControls();
    const newValue = formatValue({
      formatType,
      unit,
      precision,
      precisionType,
      useDigitSeparator,
      prefix,
      suffix: {O: suffixO, K: suffixK, M: suffixM, B: suffixB},
      suffixEnabled
    });
    setFormattedValue(newValue);
    console.log('Formatted Value:', newValue); // Add this line
  }, [formatType, suffixEnabled, checkBoxValue, unit,
    suffixO, suffixK, suffixM, suffixB,
    precision, precisionType, useDigitSeparator]);
  //
  const handleCheckBoxValueChanged = (name, value) => {
    if (name === 'suffixEnabled') {
      setSuffixEnabled(value);
      // Update the state of suffix controls when suffixEnabled checkbox changes
      if (!value) {
        setCheckBoxValue(false);
      } else {
        setCheckBoxValue(true);
      }
    }
  };

  const [formControls, setFormControls] = useState({
    unit: false,
    suffixEnabled: false,
    suffixO: false,
    suffixK: false,
    suffixM: false,
    suffixB: false,
    precision: false,
    precisionType: false,
    useDigitSeparator: false
  });

  const GrayBackgroundTextArea = styled.textarea`
  background-color: lightgray; /* Set the background color to gray */
  border: 1px solid #ccc; /* Add a border for better visibility */
  resize: none; /* Disable textarea resizing */
  width: 100%; /* Set the width to 100% or a specific value */
  height: 70px; /* Set the height to a specific value */
  padding: 5px; /* Add some padding for spacing */
  font-size: 40px; /* Change the font size to your desired value */
  text-align: center; /* Align the text to the center */
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
        disabled={true} // Set to true to make it readonly
      >
        <GrayBackgroundTextArea
          defaultValue={formattedValue}
          //  {formattedValue}
          readOnly
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
