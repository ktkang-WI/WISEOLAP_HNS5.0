import {Form} from 'devextreme-react';
import {Item} from 'devextreme-react/form';
import React, {useContext} from 'react';
import {Context} from '../organism/myReportAndFolder/UserReportManagement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const MyPageReportForm = () => {
  const context = useContext(Context);
  const [report] = context.state.report;
  const ref = context.state.ref;

  return (
    <Wrapper height='calc(100% - 70px)' display='flex' direction='row'>
      <Form
        ref={ref}
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
            text: '데이터 불러오기'
          }}/>
        <Item
          dataField='id'
          editorOptions={{
            readOnly: true
          }}/>
        <Item
          dataField='name'
          editorOptions={{
          }}/>
        <Item
          dataField='subtitle'
          editorOptions={{
          }}/>
        <Item editorType='dxSelectBox'
          dataField='type'
          editorOptions={{
          }}/>
        <Item
          dataField='createdBy'
          editorOptions={{
            readOnly: true
          }}/>
        <Item
          dataField='createdDate'
          editorOptions={{
            readOnly: true
          }}/>
        <Item
          dataField='tag'
          editorOptions={{
          }}/>
        <Item
          dataField='ordinal'
          editorOptions={{
          }}/>
        <Item editorType='dxTextArea'
          dataField='desc'
          editorOptions={{
          }}/>
        <Item editorType='dxTextArea'
          dataField='query'
          editorOptions={{
            readOnly: true
          }}/>
      </Form>
    </Wrapper>
  );
};
export default React.forwardRef(MyPageReportForm);
