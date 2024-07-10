import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Form from 'devextreme-react/form';
import {
  createCheckBoxItemProperties,
  createNumberBoxItemProperties,
  createSelectBoxItemProperties,
  createTextBoxItemProperties,
  generateItems
} from '../ConfigureFormCreator';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import localizedString from 'config/localization';

const dataManegementNumberBox = [
  'searchTimeOut',
  'searchLimitSize',
  'concurrentTaskLimit',
  'serverExcelDownloadProcessingCount'
];

const dashboardSettingsSelectBox = [
  {
    'dataField': 'mainLayout',
    'items': localizedString.config.advanced.initLayout
  },
  {
    'dataField': 'reportAuth',
    'items': localizedString.config.advanced.initReportAuth
  }
];
const dashboardSettingsTextBox = [
  'nullValue'
];

const userSettingsNumberBox = [
  'unusedExpirationDate',
  'concurrentConnectionLimit',
  'passwordChangePeriod',
  'accountLockoutOnLoginFailure'
];

const viewerSettingsCheckBox = [
  'dashboardDataField',
  'viewerUrlWithReport',
  'viewerAutoDisplayConfig',
  'designerShortcutEnabled'
];

const querySettingsCheckBox = [
  'queryErrorLogVisible',
  'queryCacheEnabled'
];

const AdvancedConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [advanced] = getContext.state.advanced;
  const ref = getContext.state.ref;
  const items = [
    {
      'title': '데이터 관리',
      // 'visible': false,
      'items': [
        ...dataManegementNumberBox.map((field) => createNumberBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': '사용자 설정',
      // 'visible': false,
      'items': [
        ...userSettingsNumberBox.map((field) => createNumberBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': '대시보드 설정',
      'items': [
        ...dashboardSettingsSelectBox.map((field) =>
          createSelectBoxItemProperties(
              advanced,
              field.dataField,
              advanced[field.dataField],
              field.items),
        ),
        ...dashboardSettingsTextBox.map((field) => createTextBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': '뷰어 설정',
      // 'visible': false,
      'items': [
        ...viewerSettingsCheckBox.map((field) => createCheckBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': '쿼리 관련 설정',
      // 'visible': false,
      'items': [
        ...querySettingsCheckBox.map((field) => createCheckBoxItemProperties(
            advanced,
            field,
            advanced[field]))
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
        ref={ref}
        formData={advanced}
        showColonAfterLabel={true}
        colCount={2}>
        {
          generateItems(items, 'advanced')
        }
      </Form>
    </Wrapper>
  );
};

export default AdvancedConfigure;
