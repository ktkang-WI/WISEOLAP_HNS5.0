import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Form from 'devextreme-react/form';
import {generateItems} from '../ConfigureFormCreator';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';

const MenuConfgure = () => {
  const getContext = useContext(ConfigureContext);
  const ref = getContext.state.ref;
  const items = [
    {
      'title': '탭 표시 여부',
      'items': [
        {
          'dataField': 'adhoc',
          'type': 'CheckBox'
        },
        {
          'dataField': 'dashboard',
          'type': 'CheckBox'
        },
        {
          'dataField': 'spreadSheet',
          'type': 'CheckBox'
        },
        {
          'dataField': 'dataset',
          'type': 'CheckBox'
        },
        {
          'dataField': 'config',
          'type': 'CheckBox'
        },
        {
          'dataField': 'datasetViewer',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '탭 팝업 설정',
      'items': [
        {
          'dataField': 'adhoc',
          'type': 'CheckBox'
        },
        {
          'dataField': 'dashboard',
          'type': 'CheckBox'
        },
        {
          'dataField': 'spreadSheet',
          'type': 'CheckBox'
        },
        {
          'dataField': 'dataset',
          'type': 'CheckBox'
        },
        {
          'dataField': 'config',
          'type': 'CheckBox'
        },
        {
          'dataField': 'datasetViewer',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '탭 메뉴 권한',
      'items': [
        {
          'dataField': 'menuAuth',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '메인 탭 메뉴 설정',
      'items': [
        {
          'dataField': 'lookQuery',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '데이터 집합 설정',
      'items': [
        {
          'dataField': 'cubeData',
          'type': 'CheckBox'
        },
        {
          'dataField': 'newDataSetFocusCube',
          'type': 'CheckBox'
        },
        {
          'dataField': 'newDataSetFocusDs',
          'type': 'CheckBox'
        },
        {
          'dataField': 'newDataSetFocusCrossDomainJoin',
          'type': 'CheckBox'
        },
        {
          'dataField': 'newDataSetFocusQuery',
          'type': 'CheckBox'
        },
        {
          'dataField': 'newDataSetFocusSingleTable',
          'type': 'CheckBox'
        },
        {
          'dataField': 'userDataUpload',
          'type': 'CheckBox'
        },
        {
          'dataField': 'originalDataset',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '다운로드 (Office)',
      'items': [
        {
          'dataField': 'xlsx',
          'type': 'CheckBox'
        }
      ]
    },
    {
      'title': '분석항목 폴더 그룹 설정',
      'items': [
        {
          'dataField': 'FolderGroup',
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
          generateItems(items, 'menu')
        }
      </Form>
    </Wrapper>
  );
};

export default MenuConfgure;
