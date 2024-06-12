import Form, {Item, Label} from 'devextreme-react/form';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';
import {getTheme} from 'config/theme';
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
`;

const HyperlinkForm = ({formRef, formData, ...props}) => {
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
          <Label>{localizedString.name}</Label>
        </Item>
        <Item
          editorType='dxTextBox'
          dataField='link'
          isRequired={true}
        >
          <Label>URL</Label>
        </Item>
        <Item
          editorType='dxTextArea'
          dataField='description'
          editorOptions={{
            height: '150px'
          }}
        >
          <Label>{localizedString.description}</Label>
        </Item>
      </Form>
    </StyledWrapper>
  );
};

export default HyperlinkForm;
