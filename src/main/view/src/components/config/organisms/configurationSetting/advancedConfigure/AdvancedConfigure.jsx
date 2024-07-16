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
  const advanced = getContext.state.advanced;
  const ref = getContext.state.ref;
  const items = [
    {
      'title': localizedString.config.advanced.dataManagement,
      'visible': true,
      'items': [
        ...dataManegementNumberBox.map((field) => createNumberBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': localizedString.config.advanced.userSetting,
      'visible': true,
      'items': [
        ...userSettingsNumberBox.map((field) => createNumberBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': localizedString.config.advanced.dashbarodSetting,
      'visible': true,
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
      'title': localizedString.config.advanced.viewerSetting,
      'visible': true,
      'items': [
        ...viewerSettingsCheckBox.map((field) => createCheckBoxItemProperties(
            advanced,
            field,
            advanced[field]))
      ]
    },
    {
      'title': localizedString.config.advanced.querySetting,
      'visible': true,
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
