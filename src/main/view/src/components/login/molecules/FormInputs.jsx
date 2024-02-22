import {styled} from 'styled-components';
import Input from '../atoms/Input';
import {Link, useNavigate} from 'react-router-dom';
import TextButton from 'components/common/atomic/Common/Button/CommonButton';
import models from 'models';
import useModal from 'hooks/useModal';
import {setSpreadLicense}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
// import {DesignerMode} from 'components/config/configType';

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

const Span = styled.span`
  color: #7f8fa4;
`;

const FormInterval = styled.div`
  padding-top: ${(props) => {
    if (props.props === 'login') {
      return '90px';
    }
  }}
`;

const StyledInput = styled.input`
  width: 14px;
  height: 14px;
  margin-right: 5px;
  background-position: -341px -12px;
  transform: translateY(20%);
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
          <StyledInput type='checkBox' id='remainId'/>
          <label htmlFor='remainId'>
            <Span>ID Remember</Span>
          </label>
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

const FormInputs = ({contents}) => {
  const nav = useNavigate();
  const {alert} = useModal();

  const createFormBtn = (contents) => {
    const type = contents.type;
    const btnTexts =
      type === 'login' ? ['로그인', {linkBtn: '회원가입'}] : ['회원가입', {linkBtn: '취소'}];
    const path = type === 'login' ? '/editds/regist' : '/editds';
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
            onClick={async () => {
              const id = document.querySelector('#input-ID input').value;
              const password =
                document.querySelector('#input-Password input').value;
              const res = await models.Login.login(id, password);
              await setSpreadLicense();

              if (res.status == 200) {
                // TODO: 추후 권한 적용
                // 임시적용 하드코딩
                nav('dashany');
              } else if (res.response?.status == 404) {
                alert('사용자 정보가 잘못되었습니다.');
              } else if (res.response?.status == 500) {
                alert('서버에 문제가 발생하였습니다.');
              }
            }}
          >
            {btnText.linkBtn ? btnText.linkBtn : btnText}
          </TextButton>
        );
      }
    });
  };
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
