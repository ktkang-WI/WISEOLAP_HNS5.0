import {Button} from 'devextreme-react';
import {Form, GroupItem, Item} from 'devextreme-react/form';
import styled from 'styled-components';

const Content = styled.div`
  height:100%;
  width:100%;
  margin: 10px;
  background: #ffffff;
  border: 1px solid #D4D7DC;
  border-radius: 10px;
  box-sizing: border-box;
`;

const UserInfoManagement = () => {
  const nameEditorOptions = {disabled: false};
  return (
    <>
      <Content>
        <Form
          width={'500px'}
          formData={[]}>
          <GroupItem colCount={1} caption='개인정보'>
            <Item
              dataField='userId'
              editorOptions={nameEditorOptions}
            ></Item>
            <Item
              dataField='userName'
            ></Item>
            <Item
              dataField='email1'
            ></Item>
            <Item
              dataField='email2'
            ></Item>
            <Item
              dataField='TelNo'
            ></Item>
            <Item
              dataField='cellPhone'
            ></Item>
            <Item
              dataField='비밀번호 변경' // localized
            >
              <Button>비밀번호 변경</Button>
            </Item>
          </GroupItem>
        </Form>
        <div>
          <button>취소</button>
          <button>저장</button>
        </div>
      </Content>
    </>
  );
};
export default UserInfoManagement;
