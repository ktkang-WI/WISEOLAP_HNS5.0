import Form, {
  Item, GroupItem
} from 'devextreme-react/form';
import {Button} from 'devextreme-react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import CusTomFileUploader from '../../userGroupManagement/common/FileUploader';
import React, {useContext} from 'react';
import {ConfigureContext} from '../ConfigurationSetting';
import localizedString from 'config/localization';

const GeneralConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;
  const ref = getContext.state.ref;
  const nameEditorOptions = {disabled: false};

  return (
    <Form
      ref={ref}
      formData={general}>
      <GroupItem colCount={1} caption='라이센스 정보'>
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
                  defaultImage={general.loginImage}
                  title='로그인 이미지'
                  id='login'/>
                <Button>기본 이미지로 변경</Button>
              </Wrapper>
            </Wrapper>
            <Wrapper size="1" display='flex' direction='row'>
              <Wrapper display='flex' direction='column'>
                <CusTomFileUploader
                  defaultImage={general.logo}
                  title='아이콘 이미지'
                  id='icon'/>
                <Button>기본 이미지로 변경</Button>
              </Wrapper>
            </Wrapper>
          </Wrapper>
        </Item>
      </GroupItem>
      <GroupItem colCount={1} caption='초기화면'>
        <Item
          dataField="WI_DEFAULT_PAGE"
          editorType='dxSelectBox'
          editorOptions={{
            items: localizedString.initPages,
            displayExpr: 'caption',
            valueExpr: 'name',
            value: general.menuConfig.Menu.WI_DEFAULT_PAGE,
            onValueChanged: (e) => {
              general.menuConfig.Menu.WI_DEFAULT_PAGE = e.value;
            }
          }}
        ></Item>
      </GroupItem>
    </Form>
  );
};

export default React.forwardRef(GeneralConfigure);
