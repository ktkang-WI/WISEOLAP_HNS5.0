import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useContext} from 'react';
import Form from 'devextreme-react/form';
import {ConfigureContext} from '../ConfigurationSetting';
import localizedString from 'config/localization';
import {
  createSelectBoxItemProperties,
  createTextBoxItemProperties,
  generateItems
} from '../ConfigureFormCreator';


const licenseInformationTextBox = [
  'licensesKey',
  'spreadJsLicense',
  'spreadJsDesignLicense',
  'kakaoMapApiKey'
];

const appTitleTextBox = [
  'mainTitle'
];

const initLayoutSelectBox = [
  {
    'dataField': 'wiDefaultPage',
    'items': localizedString.initPages
  }
];

const GeneralConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;
  const ref = getContext.state.ref;

  const items = [
    {
      'title': '라이센스 정보',
      'items': [
        ...licenseInformationTextBox.map((field) => createTextBoxItemProperties(
            general,
            field,
            general[field]))
      ]
    },
    {
      'title': '솔루션 제목',
      'items': [
        ...appTitleTextBox.map((field) => createTextBoxItemProperties(
            general,
            field,
            general[field]))
      ]
    },
    {
      'title': '초기화면',
      'items': [
        ...initLayoutSelectBox.map((field) =>
          createSelectBoxItemProperties(
              general,
              field.dataField,
              general[field.dataField],
              field.items),
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
        formData={general}
        showColonAfterLabel={true}>
        {
          generateItems(items, 'general')
        }
      </Form>
    </Wrapper>
  );
};

export default GeneralConfigure;
