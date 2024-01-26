import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import SelectTableModal from 'components/dataset/modal/SelectTableModal';
import SelectColumnModal from 'components/dataset/modal/SelectColumnModal';

const ListOptionForm = ({param, onFieldDataChanged, ...props}) => {
  const {openModal} = useModal();
  const dataSoureTypeSource = [
    {name: 'TABLE', caption: localizedString.table},
    {name: 'QUERY', caption: localizedString.query}
  ];

  const sortOrderTypeSource = [
    {name: 'ASC', caption: localizedString.asc},
    {name: 'DESC', caption: localizedString.desc}
  ];

  const isBetween = param.operation == 'BETWEEN';

  const dataSrcSearchBtn = {
    name: 'dataSrcSearchBtn',
    location: 'after',
    options: {
      visible: param.dataSourceType == 'TABLE',
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      onClick: (e) => {
        openModal(SelectTableModal, {
          onSubmit: (selectedTable) => {
            const e = {};
            e.dataField = 'dataSource';
            e.value = selectedTable.TBL_NM;
            onFieldDataChanged(e);
          },
          dsId: param.dsId
        });
      }
    }
  };

  const itemKeySearchBtn = {
    name: 'itemKeySearchBtn',
    location: 'after',
    options: {
      visible: param.dataSourceType == 'TABLE',
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      onClick: (e) => {
        openModal(SelectColumnModal, {
          onSubmit: (selectedColumn) => {
            const e = {};
            e.dataField = 'itemKey';
            e.value = selectedColumn.COL_NM;
            onFieldDataChanged(e);
          },
          dsId: param.dsId,
          table: param.dataSource.trim()
        });
      }
    }
  };

  const itemCaptionSearchBtn = {
    name: 'itemCaptionSearchBtn',
    location: 'after',
    options: {
      visible: param.dataSourceType == 'TABLE',
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      onClick: (e) => {
        openModal(SelectColumnModal, {
          onSubmit: (selectedColumn) => {
            const e = {};
            e.dataField = 'itemCaption';
            e.value = selectedColumn.COL_NM;
            onFieldDataChanged(e);
          },
          dsId: param.dsId,
          table: param.dataSource.trim()
        });
      }
    }
  };

  const sortBySearchBtn = {
    name: 'sortBySearchBtn',
    location: 'after',
    options: {
      visible: param.dataSourceType == 'TABLE',
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      onClick: (e) => {
        openModal(SelectColumnModal, {
          onSubmit: (selectedColumn) => {
            const e = {};
            e.dataField = 'sortBy';
            e.value = selectedColumn.COL_NM;
            onFieldDataChanged(e);
          },
          dsId: param.dsId,
          table: param.dataSource.trim()
        });
      }
    }
  };

  const formData = _.cloneDeep(param);
  return (
    <Form
      labelMode='outside'
      formData={formData}
      labelLocation='left'
      colCount={2}
      onFieldDataChanged={onFieldDataChanged}
      {...props}
    >
      <Item
        editorType='dxSelectBox'
        dataField='dataSourceType'
        colSpan={2}
        editorOptions={{
          dataSource: dataSoureTypeSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.dataSourceType}*</Label>
      </Item>
      <Item
        colSpan={2}
        editorType='dxTextArea'
        dataField='dataSource'
        editorOptions={{
          height: 250,
          buttons: [dataSrcSearchBtn]
        }}
      >
        <Label>{localizedString.dataSource}*</Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='itemKey'
        editorOptions={{buttons: [itemKeySearchBtn]}}
      >
        <Label>{localizedString.itemKey}*</Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='sortBy'
        editorOptions={{buttons: [sortBySearchBtn]}}
      >
        <Label>{localizedString.sort}</Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='itemCaption'
        editorOptions={{buttons: [itemCaptionSearchBtn]}}
      >
        <Label>{localizedString.itemCaption}*</Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='sortOrder'
        editorOptions={{
          dataSource: sortOrderTypeSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{''}</Label>
      </Item>
      <Item
        colSpan={isBetween ? 1 : 2}
        editorType='dxTextArea'
        dataField='defaultValue[0]'
        editorOptions={{
          height: 250,
          text: formData.defaultValue[0]
        }}
      >
        <Label>{localizedString.defaultParameter +
        (isBetween? ' TO' : '')}</Label>
      </Item>
      {
        isBetween &&
        <Item
          editorType='dxTextArea'
          dataField='defaultValue[1]'
          editorOptions={{
            height: 250,
            value: formData.defaultValue[1]
          }}
          labelMode='none'
        >
          <Label>{localizedString.defaultParameter} FROM</Label>
        </Item>
      }
      <Item
        editorType='dxCheckBox'
        dataField='defaultValueUseSql'
      >
        <Label>{localizedString.defaultValueUseSql}</Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='multiSelect'
      >
        <Label>{localizedString.multiSelect}</Label>
      </Item>
      <Item
        colSpan={2}
        editorType='dxCheckBox'
        dataField='useAll'
      >
        <Label>{localizedString.useAll}</Label>
      </Item>
      <Item
        colSpan={2}
        editorType='dxTextBox'
        dataField='exceptionValue'
      >
        <Label>{localizedString.exceptionValue}*</Label>
      </Item>
    </Form>
  );
};

export default ListOptionForm;
