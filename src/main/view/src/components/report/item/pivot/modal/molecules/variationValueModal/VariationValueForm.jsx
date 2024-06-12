import Form, {Item, Label} from 'devextreme-react/form';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';
import {getTheme} from 'config/theme';
import {useSelector} from 'react-redux';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import variationValueType from './variationValueType.js';
import localizedString from 'config/localization';

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

const VariationValueForm = ({formRef, formData, ...props}) => {
  const dataField = useSelector(selectCurrentDataField);
  const measures = dataField.measure || [];
  const sortByItems = dataField.sortByItem || [];
  const targets = [...measures, ...sortByItems];

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
            valueExpr: 'value'
          }
          }
        >
          <Label>{localizedString.type}</Label>
        </Item>
      </Form>
      <p>
        {localizedString.variationValueWarning}
      </p>
    </StyledWrapper>
  );
};

export default VariationValueForm;
