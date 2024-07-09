import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Form from 'devextreme-react/form';
import {generateItems} from '../ConfigureFormCreator';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import localizedString from 'config/localization';

const AdvancedConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const ref = getContext.state.ref;
  const items = [
    {
      'title': '데이터 관리',
      'items': [
        {
          'dataField': 'searchTimeOut',
          'type': 'TextBox'
        },
        {
          'dataField': 'searchLimitSize',
          'type': 'TextBox'
        },
        {
          'dataField': 'concurrentTaskLimit',
          'type': 'TextBox'
        },
        {
          'dataField': 'serverExcelDownloadProcessingCount',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '사용자 설정',
      'items': [
        {
          'dataField': 'unusedExpirationDate',
          'type': 'TextBox'
        },
        {
          'dataField': 'concurrentConnectionLimit',
          'type': 'TextBox'
        },
        {
          'dataField': 'passwordChangePeriod',
          'type': 'TextBox'
        },
        {
          'dataField': 'accountLockoutOnLoginFailure',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '대시보드 설정',
      'items': [
        {
          'dataField': 'mainLayout',
          'type': 'SelectBox',
          'editorOptions': {
            items: localizedString.config.advanced.initLayout,
            displayExpr: 'caption',
            valueExpr: 'name',
            value: 'barChart',
            onValueChanged: (e) => {
              console.log(e);
            }
          }
        },
        {
          'dataField': 'reportAuth',
          'type': 'SelectBox',
          'editorOptions': {
            items: localizedString.config.advanced.initReportAuth,
            displayExpr: 'caption',
            valueExpr: 'name',
            value: 'folderAuth',
            onValueChanged: (e) => {
              console.log(e);
            }
          }
        },
        {
          'dataField': 'nullValue',
          'type': 'TextBox'
        }
      ]
    },
    {
      'title': '뷰어 설정',
      'items': [
        {
          'dataField': 'dashboardDataField',
          'type': 'CheckBox'
        },
        {
          'dataField': 'viewerUrlWithReport',
          'type': 'CheckBox'
        },
        {
          'dataField': 'viewerAutoDisplayConfig',
          'type': 'CheckBox'
        },
        {
          'dataField': 'designerShortcutEnabled',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '쿼리 관련 설정',
      'items': [
        {
          'dataField': 'queryErrorLogVisible',
          'type': 'CheckBox'
        },
        {
          'dataField': 'queryCacheEnabled',
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
