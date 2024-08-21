import {Form} from 'devextreme-react';
import React, {useState} from 'react';
import {
  Item,
  Label,
  Tab,
  TabbedItem,
  TabPanelOptions
} from 'devextreme-react/form';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import styled from 'styled-components';

const StyledForm = styled(Form)`
  & .dx-empty-message {
    display: none;
  }
`;

const MyPageReportForm = ({data}, ref) => {
  const [cubeItem, setCubeItem] = useState(() => '');

  const getDatasetInfo = () => {
    return (
      data?.datasets?.map((item, index) => {
        const datasets = `datasets[${index}]`;
        const isCube = item.datasetType == 'CUBE' ? true : false;
        return (
          <Tab
            key={index}
            title={item.datasetNm}
          >
            <TabPanelOptions
              deferRendering={false}
            />
            <Item
              dataField={`${datasets}.datasetNm`}
              editorType='dxTextBox'
              editorOptions={{
                disabled: true
              }}
            >
              <Label text={localizedString.datasetName} />
            </Item>
            <Item
              dataField={`${datasets}.datasetType`}
              editorType='dxTextBox'
              editorOptions={{
                disabled: true
              }}
            >
              <Label text={'데이터 집합 유형'} />
            </Item>
            {
              <Item
                dataField='selectBoxItems'
                editorType='dxSelectBox'
                editorOptions={{
                  items: item?.selectBoxItems || [],
                  placeholder: '아이템을 선택해 주세요.',
                  disabled: !isCube,
                  onSelectionChanged: (e) => {
                    setCubeItem(e.selectedItem);
                  }
                }}
              >
                <Label text={'아이템'} />
              </Item>
            }
            <Item
              dataField={
                isCube ? `${datasets}.${cubeItem}` : `${datasets}.datasetQuery`
              }
              editorType='dxTextArea'
              editorOptions={{
                class: 'custom-scrollbar',
                readOnly: true,
                height: '300px'
              }}
            >
              <Label text={'데이터 집합 쿼리'} />
            </Item>
          </Tab>
        );
      })
    );
  };

  return (
    <Wrapper height='calc(100% - 70px)' display='flex' direction='row'>
      <StyledForm
        ref={ref}
        formData={data}
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        width={'100%'}
        height={'100%'}
        elementAttr={{
          class: 'dx-fieldset custom-scrollbar'
        }}
      >
        <Item
          editorType='dxCheckBox'
          dataField='prompt'
          editorOptions={{
            text: localizedString.loadData
          }}>
          <Label>{localizedString.loadData}</Label>
        </Item>
        <Item
          dataField='id'
          editorOptions={{
            readOnly: true
          }}>
          <Label>{localizedString.reportId}</Label>
        </Item>
        <Item
          dataField='name'
          editorOptions={{
          }}>
          <Label>{localizedString.reportName}</Label>
        </Item>
        <Item
          dataField='subtitle'
          editorOptions={{
          }}>
          <Label>{localizedString.reportSubName}</Label>
        </Item>
        <Item editorType='dxSelectBox'
          dataField='type'
          editorOptions={{
            items: localizedString.reportTypeSelectBox,
            displayExpr: 'caption',
            valueExpr: 'name',
            disabled: true
          }}>
          <Label>{localizedString.reportType}</Label>
        </Item>
        <Item
          dataField='createdBy'
          editorOptions={{
            readOnly: true
          }}>
          <Label>{localizedString.publisher}</Label>
        </Item>
        <Item
          dataField='createdDate'
          editorOptions={{
            readOnly: true
          }}>
          <Label>{localizedString.registerDate}</Label>
        </Item>
        <Item
          dataField='tag'
          editorOptions={{
          }}>
          <Label>{localizedString.annotation}</Label>
        </Item>
        <Item
          dataField='ordinal'
          editorOptions={{
          }}>
          <Label>{localizedString.order}</Label>
        </Item>
        <Item editorType='dxTextArea'
          dataField='desc'
          editorOptions={{
          }}>
          <Label>{localizedString.description}</Label>
        </Item>
        <TabbedItem>
          {getDatasetInfo()}
        </TabbedItem>
      </StyledForm>
    </Wrapper>
  );
};
export default React.forwardRef(MyPageReportForm);
