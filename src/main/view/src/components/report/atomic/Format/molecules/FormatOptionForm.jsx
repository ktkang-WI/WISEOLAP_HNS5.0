import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import TextBox from 'devextreme-react/text-box';
import NumberBox from 'devextreme-react/number-box';
import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import React, {useState, useEffect} from 'react';

const FormatOptionForm = ({formatOptions}) => {
  const formatOptionsFormRef = React.createRef();
  const [suffixEnabled, setSuffixEnabled] = useState(false);
  const [formatType, setFormatType] = useState(
    formatOptions && formatOptions.FormatType ?
    formatOptions.FormatType: 'Number'
  );
  useEffect(() => {
    updateFormControls();
  }, [formatType, suffixEnabled]);
  const updateFormControls = () => {
    const isAutoOrGeneral = formatType === 'Auto' || formatType === 'General';
    const isScientificOrPercent =
      formatType === 'Scientific' || formatType === 'Percent';
    const isSuffixEnabled = suffixEnabled;

    setControlDisabled(
        'unit', isAutoOrGeneral || isScientificOrPercent
    );
    setControlDisabled(
        'suffixEnabled', isAutoOrGeneral || isScientificOrPercent
    );
    setControlDisabled(
        'O', isAutoOrGeneral || isScientificOrPercent || !isSuffixEnabled
    );
    setControlDisabled(
        'K', isAutoOrGeneral || isScientificOrPercent || !isSuffixEnabled
    );
    setControlDisabled(
        'M', isAutoOrGeneral || isScientificOrPercent || !isSuffixEnabled
    );
    setControlDisabled(
        'B', isAutoOrGeneral || isScientificOrPercent || !isSuffixEnabled
    );
    setControlDisabled(
        'precision', isAutoOrGeneral
    );
    setControlDisabled(
        'precisionOption', false
    );
    setControlDisabled(
        'includeGroupSeparator', isAutoOrGeneral || isScientificOrPercent
    );
  };

  const setControlDisabled = (controlName, isDisabled) => {
    const updatedControls = {...formControls};
    updatedControls[controlName] = isDisabled;
    setFormControls(updatedControls);
  };

  const handleCheckBoxValueChanged = (name, value) => {
    if (name === 'suffixEnabled') {
      setSuffixEnabled(value);
    }
  };

  const [formControls, setFormControls] = useState({
    unit: false,
    suffixEnabled: false,
    O: false,
    K: false,
    M: false,
    B: false,
    precision: false,
    precisionOption: false,
    includeGroupSeparator: false
  });
  return (
    <Form
      ref={formatOptionsFormRef}
      labelMode='outside'
      labelLocation='left'
      formData={formatOptions}
    >
      <Item dataField='formatType' editorType='dxSelectBox'>
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
      <Item dataField='unit' editorType='dxSelectBox' visible={true}>
        <Label>{localizedString.digitUnit}: </Label>
        <SelectBox
          items={['Auto', 'Ones', 'Thousands', 'Millions', 'Billions']}
          defaultValue={formatOptions.Unit || 'Ones'}
        />
      </Item>
      <Item
        dataField='suffixEnabled'
        editorType='dxCheckBox'
        visible={true}
      >
        <Label>{localizedString.customSuffix}: </Label>
        <CheckBox
          defaultValue={suffixEnabled}
          onValueChanged={
            (e) => handleCheckBoxValueChanged('suffixEnabled', e.value)}/>
      </Item>
      <Item dataField='suffixO' editorType='dxTextBox' visible={true}>
        <Label>{localizedString.suffixO}: </Label>
        <TextBox defaultValue={formatOptions.Suffix?.O || ''} />
      </Item>
      <Item dataField='suffixK' editorType='dxTextBox' visible={true}>
        <Label>{localizedString.suffixK}: </Label>
        <TextBox defaultValue={formatOptions.Suffix?.K || '천'} />
      </Item>
      <Item dataField='suffixM' editorType='dxTextBox' visible={true}>
        <Label>{localizedString.suffixM}: </Label>
        <TextBox defaultValue={formatOptions.Suffix?.M || '백만'} />
      </Item>
      <Item dataField='suffixB' editorType='dxTextBox' visible={true}>
        <Label>{localizedString.suffixB}: </Label>
        <TextBox defaultValue={formatOptions.Suffix?.B || '십억'} />
      </Item>
      <Item dataField='precision' editorType='dxNumberBox'>
        <Label>{localizedString.decimalUnit}: </Label>
        <NumberBox
          step={1}
          min={0}
          max={5}
          format="#"
          showSpinButtons={true}
          defaultValue={formatOptions.Precision || 0}
        />
      </Item>
      <Item dataField='precisionOption' editorType='dxSelectBox'>
        <Label>{localizedString.roundUnit}: </Label>
        <SelectBox
          items={['반올림', '올림', '버림']}
          defaultValue={formatOptions.PrecisionOption || '반올림'}
        />
      </Item>
      <Item dataField='includeGroupSeparator' editorType='dxCheckBox'>
        <Label>{localizedString.includesGroupDistinction}: </Label>
        <CheckBox
          defaultValue={
            formatOptions.IncludeGroupSeparator!==
            undefined ?
            formatOptions.IncludeGroupSeparator: true
          }
        />
      </Item>
    </Form>
  );
};

export default FormatOptionForm;
