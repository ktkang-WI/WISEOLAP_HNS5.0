import {Form} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import {useContext} from 'react';
import {Context} from '../organism/myReportAndFolder/UserReportManagement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';

const MyPageReportForm = () => {
  const context = useContext(Context);
  const [report] = context.state.report;

  return (
    <Wrapper height='calc(100% - 70px)' display='flex' direction='row'>
      <Form
        formData={report}
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
            value: (report.prompt || report.prompt == 'Y') ? true : false,
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
            value: report.type
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
        <Item editorType='dxTextArea'
          dataField='query'
          editorOptions={{
            readOnly: true
          }}>
          <Label>{localizedString['log'].query}</Label>
        </Item>
      </Form>
    </Wrapper>
  );
};
export default MyPageReportForm;
