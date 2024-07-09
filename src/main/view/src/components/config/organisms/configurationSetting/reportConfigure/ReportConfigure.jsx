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
    },
    {
      'title': '보고서 설정',
      'items': [
        {
          'dataField': 'instantReportRetrieval',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '차트 기본색상 설정',
      'items': [
        {
          'dataField': 'chartDefaultColor',
          'type': 'SelectBox',
          'editorOptions': {
            items: localizedString.config.report.initPalette,
            displayExpr: 'caption',
            valueExpr: 'name',
            value: 'default',
            onValueChanged: (e) => {
              console.log(e);
            }
          }
        }
      ]
    },
    {
      'title': '보고서 레이아웃 설정',
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
      'items': [
        {
          'dataField': 'print',
          'type': 'CheckBox'
        },
        {
          'dataField': 'sheet',
          'type': 'CheckBox'
        },
        {
          'dataField': 'table',
          'type': 'CheckBox'
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
        colCount={2}
      >
        {generateItems(items, 'report')}
      </Form>
    </Wrapper>
  );
};

export default ReportConfigure;
