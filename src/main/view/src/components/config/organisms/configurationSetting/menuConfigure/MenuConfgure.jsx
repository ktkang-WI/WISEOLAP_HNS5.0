import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Form from 'devextreme-react/form';
import {
  createCheckBoxItemProperties,
  generateItems
} from '../ConfigureFormCreator';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import localizedString from 'config/localization';

const tabVisibleCheckBox = [
  'tabAdhoc',
  'tabDashboard',
  'tabSpreadSheet',
  'tabConfig'
];

const tabPopUpSettingsCheckBox = [
  'tabPopUpAdhoc',
  'tabPopUpDashboard',
  'tabPopUpSpreadSheet',
  'tabPopUpConfig'
];

const tabAuthCheckBox = [
  'menuAuth'
];

const mainTabCheckBox = [
  'lookQuery',
  'reportHistory',
  'searchReport'
];

const datasetSettingsCheckBox = [
  'cubeData',
  // 'newDataSetFocusCube', 주제영역 기준
  // 'newDataSetFocusCrossDomainJoin', 이기종조인
  'newDataSetFocusQuery',
  'newDataSetFocusSingleTable',
  'userDataUpload'
  // 'originalDataset' 기존 데이터 집합
];

const officeDownloadCheckBox = [
  'officeVisible',
  'officeXlsx',
  'officeXls',
  'officeDoc',
  'officePpt'
];

const hancomDownloadCheckBox = [
  'hancomVisible',
  'hancomHwp',
  'hancomCell',
  'hancomShow'
];

const etcDownloadCheckBox = [
  'etcVisible',
  'etcImg',
  'etcHtml',
  'etcPpt'
];

const MenuConfgure = () => {
  const getContext = useContext(ConfigureContext);
  const menu = getContext.state.menu;
  const ref = getContext.state.ref;
  const items = [
    {
      'title': localizedString.config.menu.tabVisible,
      'visible': true,
      'items': [
        ...tabVisibleCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.tabPopupSetting,
      'visible': false,
      'items': [
        ...tabPopUpSettingsCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.tabMenuAuth,
      'visible': false,
      'items': [
        ...tabAuthCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.mainTabMenuSetting,
      'visible': true,
      'items': [
        ...mainTabCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.datasetSetting,
      'visible': true,
      'items': [
        ...datasetSettingsCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.downloadOffice,
      'visible': false,
      'items': [
        ...officeDownloadCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.downloadHancom,
      'visible': false,
      'items': [
        ...hancomDownloadCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
      ]
    },
    {
      'title': localizedString.config.menu.downloadEtc,
      'visible': false,
      'items': [
        ...etcDownloadCheckBox.map((field) =>
          createCheckBoxItemProperties(
              menu,
              field,
              menu[field]),
        )
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
          generateItems(items, 'menu')
        }
      </Form>
    </Wrapper>
  );
};

export default MenuConfgure;
