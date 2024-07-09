import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useContext} from 'react';
import Form from 'devextreme-react/form';
import {ConfigureContext} from '../ConfigurationSetting';
import localizedString from 'config/localization';
import {generateItems} from '../ConfigureFormCreator';

const GeneralConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;
  const ref = getContext.state.ref;

  const items = [
    {
      'title': '라이센스 정보',
      'items': [
        {
          'dataField': 'licensesKey',
          'type': 'TextBox'
        },
        {
          'dataField': 'spreadJsLicense',
          'type': 'TextBox'
        },
        {
          'dataField': 'spreadJsDesignLicense',
          'type': 'TextBox'
        },
        {
          'dataField': 'kakaoMapApiKey',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '솔루션 제목',
      'items': [
        {
          'dataField': 'mainTitle',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '기본 URL',
      'items': [
        {
          'dataField': 'webUrl',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '초기화면',
      'items': [
        {
          'type': 'SelectBox',
          'dataField': 'wiDefaultPage',
          'editorOptions': {
            items: localizedString.initPages,
            displayExpr: 'caption',
            valueExpr: 'name',
            value: general.menuConfig.Menu.WI_DEFAULT_PAGE,
            onValueChanged: (e) => {
              general.menuConfig.Menu.WI_DEFAULT_PAGE = e.value;
            }
          }
        }
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
