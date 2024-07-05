// eslint-disable-next-line max-len
import Panel from 'components/config/organisms/userGroupManagement/common/Panel';
import {Form} from 'devextreme-react';
// eslint-disable-next-line max-len
import {SimpleItem, Label, TabbedItem, Tab, TabPanelOptions} from 'devextreme-react/form';
import localizedString from 'config/localization';
import React from 'react';
import DatasetType from 'components/dataset/utils/DatasetType';

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
              return (
                <Tab
                  key={index}
                  title={item.datasetNm}
                >
                  <TabPanelOptions
                    deferRendering={false}
                  />
                  <SimpleItem
                    editorType='dxTextBox'
                    editorOptions= {{
                      disabled: true,
                      value: item.datasetNm
                    }}
                  >
                    <Label text={localizedString.datasetName}/>
                  </SimpleItem>
                  <SimpleItem
                    editorType='dxTextBox'
                    editorOptions= {{
                      disabled: true,
                      value: item.datasetType
                    }}
                  >
                    <Label text={'데이터 집합 유형'}/>
                  </SimpleItem>
                  {item.datasetType !== DatasetType.CUBE &&
                    <SimpleItem
                      editorType='dxTextArea'
                      editorOptions= {{
                        value: item.datasetQuery,
                        class: 'custom-scrollbar',
                        height: '300px'
                      }}
                    >
                      <Label text={'데이터 집합 쿼리'}/>
                    </SimpleItem>
                  }
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
