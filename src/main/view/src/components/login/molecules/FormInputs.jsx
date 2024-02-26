import {styled} from 'styled-components';
import Input from '../atoms/Input';
import {Link, useNavigate} from 'react-router-dom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import models from 'models';
import useModal from 'hooks/useModal';
import {CheckBox} from 'devextreme-react';
import {getTheme} from 'config/theme';
// import {DesignerMode} from 'components/config/configType';

const theme = getTheme();

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
      return '90px';
    }
  }}
`;

const CheckBoxWrap = styled.div`
  padding-top: 10px;

  .dx-checkbox-text {
    color: ${theme.color.gray400} !important;
  }
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
          <CheckBox text='아이디 저장'/>
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
    // const btnTexts =
    //   type === 'login' ? ['로그인', {linkBtn: '회원가입'}] :
    // ['회원가입', {linkBtn: '취소'}];
    const btnTexts = ['로그인'];
    const path = type === 'login' ? '/editds/regist' : '/editds';
    return btnTexts.map((btnText, index) => {
      if (btnText.linkBtn) {
        return (
          <Link
            to={path}
            key={index}
          >
            <CommonButton
              className='link-textBtn'
              border-radius= '5px;'
            >
              {btnText.linkBtn ? btnText.linkBtn : btnText}
            </CommonButton>
          </Link>
        );
      } else {
        return (
          <CommonButton
            className='form-textBtn'
            font={theme.font.bigButton}
            key={index}
            borderRadius='8px'
            height='48px'
            onClick={async () => {
              const id = document.querySelector('#input-ID input').value;
              const password =
                document.querySelector('#input-Password input').value;
              const res = await models.Login.login(id, password);

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
          </CommonButton>
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
