import {Form} from 'devextreme-react';
import localizedString from 'config/localization';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {
  createCheckBoxItemProperties,
  createSelectBoxItemProperties,
  generateItems
} from '../ConfigureFormCreator';
import {useContext} from 'react';
import {ConfigureContext} from '../ConfigurationSetting';

const adHocSettingsSelectBox = [
  {
    'dataField': 'adHocLayout',
    'items': localizedString.adHocLayoutOptions
  }
];
const reportSettingsCheckBox = [
  'instantReportRetrieval'
];
const chartBasicColorSettingsSelectBox = [
  {
    'dataField': 'chartDefaultColor',
    'items': localizedString.config.report.initPalette
  }
];
const spreadSheetSettingsCheckBox = [
  'print',
  'sheet',
  'table'
];

const ReportConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const report = getContext.state.report;
  const items = [
    {
      'title': localizedString.config.report.adHocReportSetting,
      'visible': true,
      'items': [
        ...adHocSettingsSelectBox.map((field) =>
          createSelectBoxItemProperties(
              report,
              field.dataField,
              report[field.dataField],
              field.items),
        )
      ]
    },
    {
      'title': localizedString.config.report.reportSetting,
      'visible': true,
      'items': [
        ...reportSettingsCheckBox.map((field) => createCheckBoxItemProperties(
            report,
            field,
            report[field]))
      ]
    },
    {
      'title': localizedString.config.report.chartBasicColorSetting,
      'visible': true,
      'items': [
        ...chartBasicColorSettingsSelectBox.map((field) =>
          createSelectBoxItemProperties(
              report,
              field.dataField,
              report[field.dataField],
              field.items))
      ]
    },
    {
      'title': localizedString.config.report.reportLayout,
      'visible': true,
      'items': [
        {
          'dataField': 'reportLayoutSetting',
          'type': 'Button',
          'editorOptions': {
            'buttonLabel': '설정하기'
          }
        }
      ]
    },
    {
      'title': localizedString.config.report.spreadSheetSetting,
      'visible': true,
      'items': [
        ...spreadSheetSettingsCheckBox.map((field) =>
          createCheckBoxItemProperties(
              report,
              field,
              report[field]))
      ]
    }
  ];

  return (
    <Wrapper
      padding='20px 100px 0px 30px'
      overflow={'auto'}
      className='custom-scrollbar'
    >
      <Form
        colCount={2}
      >
        {generateItems(items, 'report')}
      </Form>
    </Wrapper>
  );
};

export default ReportConfigure;
