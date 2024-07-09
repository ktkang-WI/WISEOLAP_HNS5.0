import {GroupItem, Item, Label} from 'devextreme-react/form';
import CusTomFileUploader from '../userGroupManagement/common/FileUploader';
import {Button} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';

const configLocalization = localizedString.config;

const labelTemplate = (iconName) => {
  return function template(data) {
    return (
      <>
        {data.text}
      </>
    );
  };
};

const createTextBoxItem = (dataField, labelText, icon, editorOptions) => (
  <Item dataField={dataField} editorOptions={{
    disabled: false, ...editorOptions
  }}>
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate(icon)}
    />
  </Item>
);

const createFormUploadItem = (dataField, labelText, icon, editorOptions) => (
  <Item dataField={dataField} editorOptions={{
    disabled: false, ...editorOptions
  }}>
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

const createSelectBoxItem = (dataField, labelText, icon, editorOptions) => (
  <Item
    editorType='dxSelectBox'
    editorOptions={editorOptions}
  >
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate('description')} />
  </Item>
);
const createCheckBoxItem = (dataField, labelText, icon, editorOptions) => (
  <Item
    editorType='dxCheckBox'
    editorOptions={{
      value: false,
      ...editorOptions
    }}
  >
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate('description')} />
  </Item>
);
const createButtonItem = (dataField, labelText, icon, editorOptions) => (
  <Item>
    <Button
      onClick={editorOptions?.onClick}
    >
      {editorOptions?.buttonLabel}
    </Button>
    <Label
      text={labelText}
      alignment='start'
      render={labelTemplate('description')} />
  </Item>
);

export const formCreator = {
  'TextBox': createTextBoxItem,
  'Upload': createFormUploadItem,
  'SelectBox': createSelectBoxItem,
  'CheckBox': createCheckBoxItem,
  'Button': createButtonItem
};

export const generateItems = (items, page, options = {}) => {
  return items.map((item, i) => {
    const children = item.items;
    return (
      <GroupItem
        cssClass='dx-field-group-wrapper'
        caption={item.title}
        key={i}
        colCount={item.colCount || 1}
        form-group='dx-form-group'
      >
        {
          children.map(({dataField, type, editorOptions}) => {
            return formCreator[type](
                dataField,
                configLocalization[page][dataField],
                'description',
                editorOptions
            );
          })
        }
      </GroupItem>
    );
  });
};
