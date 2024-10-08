// eslint-disable-next-line max-len
import Panel from 'components/config/organisms/userGroupManagement/common/Panel';
import {Form} from 'devextreme-react';
// eslint-disable-next-line max-len
import {SimpleItem, Label, TabbedItem, Tab, TabPanelOptions} from 'devextreme-react/form';
import localizedString from 'config/localization';
import React from 'react';

// TODO: tab 포함 form이 추가 될 시, 재사용 할 수 있도록 configureFormCreator 에 generate 함수 생성
const ReportInfo = ({itemData}) => {
  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={itemData}
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'calc(100% - 10px)'}
        elementAttr={{
          class: 'dx-fieldset custom-scrollbar form-tab'
        }}
      >
        <SimpleItem
          dataField="id"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportId}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="name"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportType"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportType}</Label>
        </SimpleItem>
        {itemData.datasetInfo && itemData.datasetInfo.length > 0 &&
          <TabbedItem>
            {itemData.datasetInfo.map((item, index) => {
              const dataFieldPrefix = `datasetInfo[${index}]`;
              return (
                <Tab
                  key={index}
                  title={item.datasetNm}
                >
                  <TabPanelOptions
                    deferRendering={false}
                  />
                  <SimpleItem
                    dataField={`${dataFieldPrefix}.datasetNm`}
                    editorType='dxTextBox'
                    editorOptions= {{
                      disabled: true
                    }}
                  >
                    <Label text={localizedString.datasetName}/>
                  </SimpleItem>
                  <SimpleItem
                    dataField={`${dataFieldPrefix}.datasetType`}
                    editorType='dxTextBox'
                    editorOptions= {{
                      disabled: true
                    }}
                  >
                    <Label text={'데이터 집합 유형'}/>
                  </SimpleItem>
                  <SimpleItem
                    dataField={`${dataFieldPrefix}.datasetQuery`}
                    editorType='dxTextArea'
                    editorOptions= {{
                      class: 'custom-scrollbar',
                      height: '300px',
                      readOnly: true
                    }}
                  >
                    {
                      item.datasetType !== 'CUBE' ?
                      <Label text={'데이터 집합 쿼리'}/> :
                      <Label text={'데이터 집합 정보'}/>
                    }
                  </SimpleItem>
                </Tab>
              );
            })}
          </TabbedItem>
        }
      </Form>
    </Panel>
  );
};

export default React.memo(ReportInfo);
