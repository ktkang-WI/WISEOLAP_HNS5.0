import {Form} from 'devextreme-react';
import {GroupItem, Item} from 'devextreme-react/form';
import {useContext} from 'react';
import {Context} from '../organism/myReportAndFolder/UserReportManagement';

const MyPageReportForm = () => {
  const context = useContext(Context);
  const [report] = context.state.report;

  return (
    <Form
      formData={report}
    >
      <Item
        editorType='dxCheckBox'
        dataField='prompt'
        editorOptions={{
          value: (report.prompt || report.prompt == 'Y') ? true : false,
          text: '데이터 불러오기'
        }}></Item>
      <Item
        dataField='id'
        editorOptions={{
          readOnly: true
        }}></Item>
      <Item
        dataField='name'
        editorOptions={{
        }}></Item>
      <Item
        dataField='subtitle'
        editorOptions={{
        }}></Item>
      <Item editorType='dxSelectBox'
        dataField='type'
        editorOptions={{
          value: report.type
        }}></Item>
      <Item
        dataField='createdBy'
        editorOptions={{
          readOnly: true
        }}></Item>
      <Item
        dataField='createdDate'
        editorOptions={{
          readOnly: true
        }}></Item>
      <Item
        dataField='tag'
        editorOptions={{
        }}></Item>
      <Item
        dataField='ordinal'
        editorOptions={{
        }}></Item>
      <Item editorType='dxTextArea'
        dataField='desc'
        editorOptions={{
        }}></Item>
      <GroupItem caption='수행쿼리'>
        <Item editorType='dxTextArea'
          dataField='query'
          editorOptions={{
            readOnly: true
          }}></Item>
      </GroupItem>
    </Form>
  );
};
export default MyPageReportForm;
