import Form, {Item, Label} from 'devextreme-react/form';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';
import {getTheme} from 'config/theme';
import {useSelector} from 'react-redux';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import variationValueType from './variationValueType.js';
import localizedString from 'config/localization';
import {useState} from 'react';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;

  .dx-texteditor-input {
    padding: 0px 9px 0px;
    font-size: 14px;
  }
  
  p {
    width: 100%;
    font: ${theme.font.small};
    text-align: right;
    color: ${theme.color.gray400};
  }
`;

const VariationValueForm = ({formRef, formData, alertRef, ...props}) => {
  const dataField = useSelector(selectCurrentDataField);
  const measures = dataField.measure || [];
  const [alert, setAlert] = useState('');
  // TODO: 추후 pivotMatrix 개선 후 적용
  // const sortByItems = dataField.sortByItem || [];
  const targets = measures;

  const getValidation = (e) => {
    const variationValueList = ['absoluteVariation', 'percentVariation'];

    if (!e.selectedItem) return;

    if (variationValueList.includes(e.selectedItem.value)) {
      setAlert('*' + localizedString.requiredRowColumn);
    } else {
      setAlert('');
    }
  };

  return (
    <StyledWrapper>
      <Form
        ref={formRef}
        formData={formData}
        {...props}
      >
        <Item
          editorType='dxTextBox'
          dataField='name'
          isRequired={true}
        >
          <Label>{localizedString.fieldName}</Label>
        </Item>
        <Item
          editorType='dxSelectBox'
          dataField='targetId'
          isRequired={true}
          editorOptions={{
            items: targets,
            displayExpr: 'caption',
            valueExpr: 'fieldId'
          }}
        >
          <Label>{localizedString.targetFieldName}</Label>
        </Item>
        <Item
          editorType='dxSelectBox'
          dataField='type'
          isRequired={true}
          editorOptions={{
            items: variationValueType,
            displayExpr: 'caption',
            valueExpr: 'value',
            onSelectionChanged: getValidation
          }}
        >
          <Label>{localizedString.type}</Label>
        </Item>
      </Form>
      <p>
        {localizedString.variationValueWarning}
      </p>
      <p ref={alertRef} style={{color: 'red'}}>
        {alert}
      </p>
    </StyledWrapper>
  );
};

export default VariationValueForm;
