import {styled} from 'styled-components';
import Input from '../atoms/Input';
import {Link} from 'react-router-dom';
import TextButton from 'components/common/atoms/CommonButton';

const StyledForm = styled.form.attrs(() => ({
  action: 'http://localhost:3000/editds'
}))`
  & > .interval > .form-textBtn {
    margin-bottom: 7px;
  }
  & > .interval > a > .link-textBtn {
    margin-top: 7px;
  }
`;

const FormInterval = styled.div`
  padding-top: ${(props) => {
    if (props.props === 'login') {
      return '100px';
    }
  }}
`;

const CheckBoxWrap = styled.div`
  padding-top: 10px;
`;

const CheckBoxSpanWrap = styled.span`
  padding : 5px;
  float: left;
`;

const createInputForm = (contents) => {
  return (
    <Input contents={contents}/>
  );
};

const createCheckBox = (contents) => {
  const type = contents.type;
  if (type === 'login') {
    return (
      <CheckBoxWrap>
        <CheckBoxSpanWrap>
          <input type='checkBox' id='remainId'/>
          <label htmlFor='remainId'>Remain ID</label>
        </CheckBoxSpanWrap>
      </CheckBoxWrap>
    );
  } else {
    return (
      <CheckBoxWrap>
        <CheckBoxSpanWrap></CheckBoxSpanWrap>
      </CheckBoxWrap>
    );
  }
};

const createFormBtn = (contents) => {
  const type = contents.type;
  const btnTexts =
    type === 'login' ? ['로그인', {linkBtn: '회원가입'}] : ['회원가입', {linkBtn: '취소'}];
  const path = type === 'login' ? '/editds/login/regist' : '/editds/login';
  return btnTexts.map((btnText, index) => {
    if (btnText.linkBtn) {
      return (
        <Link
          to={path}
          key={index}
        >
          <TextButton
            className='link-textBtn'
            border-radius= '5px;'
          >
            {btnText.linkBtn ? btnText.linkBtn : btnText}
          </TextButton>
        </Link>
      );
    } else {
      return (
        <TextButton
          className='form-textBtn'
          key={index}
          border-radius= '5px;'
        >
          {btnText.linkBtn ? btnText.linkBtn : btnText}
        </TextButton>
      );
    }
  });
};

const FormInputs = ({contents}) => {
  return (
    <StyledForm id='send-login-data'>
      {createInputForm(contents)}
      {createCheckBox(contents)}
      <FormInterval className='interval' props={contents.type}>
        {createFormBtn(contents)}
      </FormInterval>
    </StyledForm>
  );
};
export default FormInputs;
