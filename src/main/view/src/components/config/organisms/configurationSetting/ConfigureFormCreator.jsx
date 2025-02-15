import {GroupItem, Item, Label} from 'devextreme-react/form';
import CusTomFileUploader from '../userGroupManagement/common/FileUploader';
import {Button} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';

const configLocalization = localizedString.config;

const itemType = {
  'TextBox': 'TextBox',
  'Upload': 'Upload',
  'SelectBox': 'SelectBox',
  'CheckBox': 'CheckBox',
  'Button': 'Button',
  'NumberBox': 'NumberBox'
};

const createItemDefaultProperties = (
    dataset, dataField, value, type, items, readOnly) => ({
  'dataField': dataField,
  'type': type,
  'editorOptions': {
    ...(itemType.SelectBox === type ? {items: items} : {}),
    ...(itemType.SelectBox === type ? {displayExpr: 'caption'} : {}),
    ...(itemType.SelectBox === type ? {valueExpr: 'name'} : {}),
    value: value,
    readOnly: readOnly == true ? true: false,
    onValueChanged: (e) => {
      dataset[dataField] = e.value;
    }
  }
});

export const createNumberBoxItemProperties = (dataset, dataField, value) =>
  createItemDefaultProperties(dataset, dataField, value, itemType.NumberBox);

export const createTextBoxItemProperties = (dataset, dataField, value) =>
  createItemDefaultProperties(dataset, dataField, value, itemType.TextBox);

export const createCheckBoxItemProperties = (dataset, dataField, value) =>
  createItemDefaultProperties(dataset, dataField, value, itemType.CheckBox);

export const createSelectBoxItemProperties = (
    dataset, dataField, value, items) =>
  createItemDefaultProperties(
      dataset, dataField, value, itemType.SelectBox, items);

export const createTextBoxReadOnlyItemProperties = (
    dataset, dataField, value, readOnly) =>
  createItemDefaultProperties(
      dataset, dataField, value, itemType.TextBox, undefined, readOnly);


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

const createNumberBoxItem = (dataField, labelText, icon, editorOptions) => (
  <Item
    editorType='dxNumberBox'
    dataField={dataField} editorOptions={{
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
  [itemType.TextBox]: createTextBoxItem,
  [itemType.Upload]: createFormUploadItem,
  [itemType.SelectBox]: createSelectBoxItem,
  [itemType.CheckBox]: createCheckBoxItem,
  [itemType.Button]: createButtonItem,
  [itemType.NumberBox]: createNumberBoxItem
};

export const generateItems = (items, page, options = {}) => {
  return items.map((item, i) => {
    const children = item.items;
    if (item?.visible === false) return;
    return (
      <GroupItem
        cssClass='dx-field-group-wrapper'
        caption={item.title}
        key={i}
        colCount={item.colCount || 1}
        form-group='dx-form-group'
      >
        {
          children.map(({dataField, type, visible, editorOptions}) => {
            if (visible === false) return;
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
