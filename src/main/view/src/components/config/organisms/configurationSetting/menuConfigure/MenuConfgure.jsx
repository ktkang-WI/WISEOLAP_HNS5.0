import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Form from 'devextreme-react/form';
import {
  createCheckBoxItemProperties,
  generateItems
} from '../ConfigureFormCreator';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';

const tabVisibleCheckBox = [
  'tabAdhoc',
  'tabDashboard',
  'tabSpreadSheet',
  'tabDataset',
  'tabConfig',
  'tabDatasetViewer'
];

const tabPopUpSettingsCheckBox = [
  'tabPopUpAdhoc',
  'tabPopUpDashboard',
  'tabPopUpSpreadSheet',
  'tabPopUpConfig',
  'tabPopUpDatasetViewer'
];

const tabAuthCheckBox = [
  'menuAuth'
];

const mainTabCheckBox = [
  'lookQuery'
];

const datasetSettingsCheckBox = [
  'cubeData',
  'newDataSetFocusCube',
  'newDataSetFocusCrossDomainJoin',
  'newDataSetFocusQuery',
  'newDataSetFocusSingleTable',
  'userDataUpload',
  'originalDataset'
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
  const [menu] = getContext.state.menu;
  const ref = getContext.state.ref;
  const items = [
    {
      'title': '탭 표시 여부',
      // 'visible': false,
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
      'title': '탭 팝업 설정',
      // 'visible': false,
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
      'title': '탭 메뉴 권한',
      // 'visible': false,
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
      'title': '메인 탭 메뉴 설정',
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
      'title': '데이터 집합 설정',
      // 'visible': false,
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
      'title': '다운로드 (Office)',
      // 'visible': false,
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
      'title': '다운로드 (Hancom)',
      // 'visible': false,
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
      'title': '다운로드 (etc)',
      // 'visible': false,
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
        formData={menu}
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
