import {Form} from 'devextreme-react';
import localizedString from 'config/localization';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import {AdHocLayoutTypes} from 'components/config/configType';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {generateItems} from '../ConfigureFormCreator';

const ReportConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;

  const items = [
    {
      'title': '비정형 보고서 설정',
      'items': [
        {
          'type': 'SelectBox',
          'dataField': 'adHocLayout',
          'editorOptions': {
            items: localizedString.adHocLayoutOptions,
            valueExpr: 'id',
            displayExpr: 'text',
            value: AdHocLayoutTypes[general.adHocLayout],
            onValueChanged: (e) => {
              general.adHocLayout = AdHocLayoutTypes[e.value];
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
        formData={general}
      >
        {generateItems(items, 'report')}
      </Form>
    </Wrapper>
  );
};

export default ReportConfigure;
