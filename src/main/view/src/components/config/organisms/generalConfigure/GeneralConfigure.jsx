import Form, {
  Item, GroupItem
} from 'devextreme-react/form';
import {Button} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import CusTomFileUploader from '../userGroupManagement/common/FileUploader';
import {useLoaderData} from 'react-router-dom';


const GeneralConfigure = () => {
  const {generalConfigure} = useLoaderData();

  console.log(generalConfigure);
  const nameEditorOptions = {disabled: false};

  return (
    <Form
      formData={generalConfigure}>
      <GroupItem colCount={1}>
        <Item
          dataField="licensesKey"
          editorOptions={nameEditorOptions}/>
        <Item
          dataField="spreadJsLicense"
          editorOptions={nameEditorOptions}/>
        <Item
          dataField="spreadJsDesignLicense"
          editorOptions={nameEditorOptions}/>
        <Item
          dataField="kakaoMapApiKey"
          editorOptions={nameEditorOptions}/>
      </GroupItem>
      <GroupItem colCount={1} caption='솔루션 제목'>
        <Item dataField="mainTitle" editorOptions={nameEditorOptions}></Item>
      </GroupItem>
      <GroupItem colCount={1} caption='기본 URL'>
        <Item dataField="webUrl" editorOptions={nameEditorOptions}></Item>
      </GroupItem>
      <GroupItem colCount={1} caption='이미지 설정'>
        <Item>
          <Wrapper
            center='center'
            width="100%"
            height="100%"
            display='flex'
            direction='row'>
            <Wrapper size="1" display='flex' direction='row'>
              <Wrapper display='flex' direction='column'>
                <CusTomFileUploader
                  defaultImage={generalConfigure.loginImage}
                  title='로그인 이미지'
                  id='login'/>
                <Button>기본 이미지로 변경</Button>
              </Wrapper>
            </Wrapper>
            <Wrapper size="1" display='flex' direction='row'>
              <Wrapper display='flex' direction='column'>
                <CusTomFileUploader
                  defaultImage={generalConfigure.logo}
                  title='아이콘 이미지'
                  id='icon'/>
                <Button>기본 이미지로 변경</Button>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Item>
      </GroupItem>
    </Form>
  );
};

export default GeneralConfigure;
