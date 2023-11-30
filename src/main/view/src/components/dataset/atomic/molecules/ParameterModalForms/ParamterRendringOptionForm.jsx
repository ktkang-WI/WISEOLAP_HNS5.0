import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import _ from 'lodash';

const ParamterRendringOptionForm = ({dataSource, ...props}) => {
  return (
    <Form
      labelMode='outside'
      formData={_.cloneDeep(dataSource)}
      readOnly={_.isEmpty(dataSource)}
      labelLocation='left'
      {...props}
    >
      <Item editorType='dxTextBox' dataField='order'>
        <Label>{localizedString.order} </Label>
      </Item>
      <Item editorType='dxNumberBox' dataField='width'>
        <Label>{localizedString.width}* </Label>
      </Item>
      <Item editorType='dxCheckBox' dataField='useCaptionWidth'>
        <Label>{localizedString.useCaptionWidth}* </Label>
      </Item>
      <Item editorType='dxNumberBox' dataField='captionWidth'>
        <Label>{localizedString.captionWidth}* </Label>
      </Item>
      <Item editorType='dxCheckBox' dataField='visible'>
        <Label>{localizedString.Visible}</Label>
      </Item>
      <Item editorType='dxCheckBox' dataField='lineBreak'>
        <Label>{localizedString.lineBreak} </Label>
      </Item>
    </Form>
  );
};

export default ParamterRendringOptionForm;
