import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useContext} from 'react';
import Form, {GroupItem, Item, Label} from 'devextreme-react/form';
import {ConfigureContext} from '../ConfigurationSetting';
import CusTomFileUploader from '../../userGroupManagement/common/FileUploader';
import {Button} from 'devextreme-react';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';

const theme = getTheme();
export const labelTemplate = (iconName) => {
  return function template(data) {
    return (
      <>
        <i className={`dx-icon dx-icon-${iconName}`}></i>
        {data.text}
      </>
    );
  };
};

const createFormItem = (dataField, labelText, icon) => (
  <Item dataField={dataField} editorOptions={{disabled: false}}>
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate(icon)}
    />
  </Item>
);

const createFormUploadItem = (dataField, labelText, icon) => (
  <Item dataField={dataField} editorOptions={{disabled: false}}>
    <Wrapper
      display='flex'
      direction='column'>
      <CusTomFileUploader
        title={labelText}
        id='login'/>
      <Button>기본 이미지로 변경</Button>
    </Wrapper>
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate(icon)} />
  </Item>
);

const GeneralConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;
  const ref = getContext.state.ref;
  const generalItems = localizedString.config.general;
  const items = [
    'licensesKey',
    'spreadJsLicense',
    'spreadJsDesignLicense',
    'kakaoMapApiKey',
    'mainTitle',
    'webUrl'];

  const uploadItems = [
    'loginImage',
    'logo'];

  return (
    <Wrapper
      maxWidth={theme.size.bigConfigMaxWidth}
      padding='20px 100px 0px 30px'
    >
      <Form
        ref={ref}
        formData={general}
        showColonAfterLabel={true}>
        <GroupItem
          colCount={2}
          form-group='dx-form-group'
        >
          {
            items.map((item) => {
              return createFormItem(
                  item,
                  generalItems[item],
                  'description');
            })
          }
        </GroupItem>
        <GroupItem colCount={2} form-group='dx-form-group'>
          {
            uploadItems.map((item) => {
              return createFormUploadItem(
                  item,
                  generalItems[item],
                  'file');
            })
          }
        </GroupItem>
        <GroupItem colCount={1} form-group='dx-form-group'>
          <Item
            dataField="WI_DEFAULT_PAGE"
            editorType='dxSelectBox'
            editorOptions={{
              items: localizedString.initPages,
              displayExpr: 'caption',
              valueExpr: 'name',
              value: general.menuConfig.Menu.WI_DEFAULT_PAGE,
              onValueChanged: (e) => {
                general.menuConfig.Menu.WI_DEFAULT_PAGE = e.value;
              }
            }}
          >
            <Label
              text={localizedString.config.general.wiDefaultPage}
              alignment='start'
              render={labelTemplate('description')} />
          </Item>
        </GroupItem>
      </Form>
    </Wrapper>
  );
};

export default GeneralConfigure;
