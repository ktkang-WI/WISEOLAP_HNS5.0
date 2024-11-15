import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useContext} from 'react';
import Form from 'devextreme-react/form';
import {ConfigureContext} from '../ConfigurationSetting';
import localizedString from 'config/localization';
import {
  selectMyPageDesignerConfig
} from 'redux/selector/ConfigSelector';
import {useSelector} from 'react-redux';
import {
  createSelectBoxItemProperties,
  createTextBoxReadOnlyItemProperties,
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
  const myPageConfigure = useSelector(selectMyPageDesignerConfig);
  const general = getContext.state.general;
  const ref = getContext.state.ref;

  const readOnlyValue = myPageConfigure?.userId === 'admin' ? false : true;

  const items = [
    {
      'title': localizedString.config.general.licenseInfo,
      'visible': !readOnlyValue,
      'items': [
        ...licenseInformationTextBox.map((field) =>
          createTextBoxReadOnlyItemProperties(
              general,
              field,
              general[field],
              readOnlyValue))
      ]
    },
    {
      'title': localizedString.config.general.solutionTitle,
      'items': [
        ...appTitleTextBox.map((field) => createTextBoxReadOnlyItemProperties(
            general,
            field,
            general[field],
            readOnlyValue))
      ]
    },
    {
      'title': localizedString.config.general.wiDefaultPage,
      'items': [
        ...initLayoutSelectBox.map((field) =>
          createSelectBoxItemProperties(
              general,
              field.dataField,
              general[field.dataField],
              field.items,
              readOnlyValue),
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
        showColonAfterLabel={true}>
        {
          generateItems(items, 'general')
        }
      </Form>
    </Wrapper>
  );
};

export default GeneralConfigure;
