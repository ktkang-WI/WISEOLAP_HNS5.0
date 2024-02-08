import Form, {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';

const CalendarOptionForm = ({param, onFieldDataChanged, ...props}) => {
  const isBetween = param.operation == 'BETWEEN';
  const defaultValueTypeSource = [
    {name: 'NOW', caption: localizedString.now},
    {name: 'QUERY', caption: localizedString.query}
  ];

  const formatSource = [
    {name: 'yyyy', caption: 'yyyy'},
    {name: 'yyyyMM', caption: 'yyyyMM'},
    {name: 'yyyyMMdd', caption: 'yyyyMMdd'},
    {name: 'yyyy-MM', caption: 'yyyy-MM'},
    {name: 'yyyy-MM-dd', caption: 'yyyy-MM-dd'}
  ];

  const periodSource = [
    {name: 'YEAR', caption: localizedString.year},
    {name: 'MONTH', caption: localizedString.month},
    {name: 'DAY', caption: localizedString.day}
  ];

  const formData = _.cloneDeep(param);

  if (!formData.calendarDefaultType) {
    const e = {};
    e.dataField = 'calendarDefaultType';
    e.value = 'NOW';
    onFieldDataChanged(e);
    formData.calendarDefaultType = 'NOW';
  }
  if (!formData.calendarPeriodBase) {
    formData.calendarPeriodBase = ['', ''];
  }
  if (!formData.calendarPeriodValue) {
    formData.calendarPeriodValue = [0, 0];
  }

  return (
    <Form
      labelMode='outside'
      formData={formData}
      id='calendar-option'
      labelLocation='left'
      colCount={2}
      onFieldDataChanged={onFieldDataChanged}
      {...props}
    >
      <Item
        colSpan={2}
        editorType='dxSelectBox'
        dataField='calendarDefaultType'
        editorOptions={{
          dataSource: defaultValueTypeSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.defaultValueType}</Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='calendarPeriodBase[0]'
        visible={formData.calendarDefaultType == 'NOW'}
        editorOptions={{
          dataSource: periodSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.defaultParameter +
          (isBetween ? ' TO' : '') + ' 기준'}</Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='calendarPeriodValue[0]'
        visible={formData.calendarDefaultType == 'NOW'}
        editorOptions={{
          dataSource: periodSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{'기본값' + (isBetween ? ' TO' : '') + ' 이동'}</Label>
      </Item>
      {
        isBetween &&
        <Item
          editorType='dxSelectBox'
          dataField='calendarPeriodBase[1]'
          visible={formData.calendarDefaultType == 'NOW'}
          editorOptions={{
            dataSource: periodSource,
            displayExpr: 'caption',
            valueExpr: 'name'
          }}
        >
          <Label>{localizedString.defaultParameter +
            (isBetween ? ' FROM' : '') + ' 기준'}</Label>
        </Item>
      }
      {
        isBetween &&
        <Item
          editorType='dxNumberBox'
          dataField='calendarPeriodValue[1]'
          visible={formData.calendarDefaultType == 'NOW'}
          editorOptions={{
            dataSource: periodSource,
            displayExpr: 'caption',
            valueExpr: 'name'
          }}
        >
          <Label>{'기본값' + (isBetween ? ' FROM' : '') + ' 이동'}</Label>
        </Item>
      }
      <Item
        colSpan={isBetween ? 1 : 2}
        editorType='dxTextArea'
        dataField='defaultValue[0]'
        visible={formData.calendarDefaultType == 'QUERY'}
        editorOptions={{
          height: 250
        }}
      >
        <Label>{localizedString.defaultParameter +
          (isBetween ? ' TO' : '')}</Label>
      </Item>
      {
        isBetween &&
        <Item
          editorType='dxTextArea'
          dataField='defaultValue[1]'
          visible={formData.calendarDefaultType == 'QUERY'}
          editorOptions={{
            height: 250
          }}
          labelMode='none'
        >
          <Label>{localizedString.defaultParameter} FROM</Label>
        </Item>
      }
      <Item
        editorType='dxCheckBox'
        dataField='defaultValueUseSql'
        colSpan={2}
        visible={formData.calendarDefaultType == 'QUERY'}
      >
        <Label>{localizedString.defaultValueUseSql}</Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='calendarKeyFormat'
        editorOptions={{
          dataSource: formatSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.calendarKeyFormat}*</Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='calendarMaxValue'
        visible={isBetween}
      >
        <Label>{localizedString.calendarMaxValue}*</Label>
      </Item>
      <Item
        editorType='dxSelectBox'
        dataField='calendarCaptionFormat'
        editorOptions={{
          dataSource: formatSource,
          displayExpr: 'caption',
          valueExpr: 'name'
        }}
      >
        <Label>{localizedString.calendarCaptionFormat}*</Label>
      </Item>
    </Form>
  );
};

export default CalendarOptionForm;
