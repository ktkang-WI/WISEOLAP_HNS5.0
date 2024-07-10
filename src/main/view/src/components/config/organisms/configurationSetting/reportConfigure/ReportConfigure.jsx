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
  const [report] = getContext.state.report;
  const items = [
    {
      'title': '비정형 보고서 설정',
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
      'title': '보고서 설정',
      // 'visible': false,
      'items': [
        ...reportSettingsCheckBox.map((field) => createCheckBoxItemProperties(
            report,
            field,
            report[field]))
      ]
    },
    {
      'title': '차트 기본색상 설정',
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
      'title': '보고서 레이아웃 설정',
      'visible': false,
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
      'title': 'Spread Sheet 설정',
      'colCount': 2,
      // 'visible': false,
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
        formData={report}
        colCount={2}
      >
        {generateItems(items, 'report')}
      </Form>
    </Wrapper>
  );
};

export default ReportConfigure;
