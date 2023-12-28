import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {useState} from 'react';

const FieldOptionForm = ({formRef, dataFieldOption}) => {
  // state
  const [detailSettingVisible, setDetailSettingVisible] =
  useState(dataFieldOption.type === 'MEA');

  // local
  const fieldType = [
    {
      display: [localizedString.dimension],
      value: 'DIM'
    },
    {
      display: [localizedString.measure],
      value: 'MEA'
    }
  ];
  const detailSettingType = [
    {
      display: [localizedString.value],
      value: 'value'
    },
    {
      display: [localizedString.bar],
      value: 'bar'
    }
  ];

  return (
    <Form
      ref={formRef}
      formData={dataFieldOption}
    >
      <Item
        editorType='dxRadioGroup'
        dataField='type'
        editorOptions={{
          items: fieldType,
          displayExpr: 'display',
          valueExpr: 'value',
          onValueChanged: () => {
            setDetailSettingVisible(!detailSettingVisible);
          }
        }}
      >
        <Label>{localizedString.fieldType}</Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='visible'
      >
        <Label>{localizedString.visibility}</Label>
      </Item>
      <Item
        editorType='dxRadioGroup'
        dataField='detailSetting'
        visible={detailSettingVisible}
        editorOptions={{
          items: detailSettingType,
          displayExpr: 'display',
          valueExpr: 'value'
        }}
      >
        <Label>{localizedString.detailSetting}</Label>
      </Item>
    </Form>
  );
};

export default FieldOptionForm;
