import {styled} from 'styled-components';
import Input from '../atoms/Input';
import {Link} from 'react-router-dom';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {CheckBox} from 'devextreme-react';
import {getTheme} from 'config/theme';

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
  .interval .form-textBtn {
    margin-left: 0px;
  }
`;

const FormInterval = styled.div`
  padding-top: ${(props) => {
    if (props.props === 'login') {
      return '50px';
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

const createInputForm = (contents, onSubmit) => {
  return (
    <Input contents={contents} onSubmit={onSubmit}/>
  );
};

const createCheckBox = (contents) => {
  // TODO: 임시 기존 아이디 방식으로 값을 가져와 임시 코드 추후변경예정
  const handleOnValueChanged = (e) => {
    localStorage.setItem('rememberId', e.value);
    if (e.value) {
      const id = document.querySelector('#input-ID input').value;
      localStorage.setItem('sessionId', id);
    } else {
      localStorage.setItem('sessionId', '');
    }
  };
  const handleOnContentReady = (e) => {
    localStorage.getItem('rememberId') === 'true' ?
    e.component.option('value', true) : e.component.option('value', false);
  };
  const type = contents.type;
  if (type === 'login') {
    return (
      <CheckBoxWrap>
        <CheckBoxSpanWrap>
          <CheckBox
            onContentReady={handleOnContentReady}
            onValueChanged={handleOnValueChanged}
            text='아이디 저장'/>
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

const FormInputs = ({contents, onSubmit}) => {
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
        //   <CommonButton
        //     className='form-textBtn'
        //     font={theme.font.bigButton}
        //     key={index}
        //     borderRadius='8px'
        //     height='48px'
        //     onClick={() => onSubmit('portal')}
        //     background={'#FE0000'}
        //     hoverBackground={'#EE0000'}
        //   >
        //     {'로그인'}
        //   </CommonButton>
        // );
          <CommonButton
            className='form-textBtn'
            font={theme.font.bigButton}
            key={index}
            borderRadius='8px'
            height='48px'
            onClick={onSubmit}
            background={'#FE0000'}
            hoverBackground={'#EE0000'}
          >
            {'로그인'}
          </CommonButton>
        );
      };
    });
  };
  return (
    <StyledForm id='send-login-data'>
      {createInputForm(contents, onSubmit)}
      {createCheckBox(contents)}
      <FormInterval className='interval' props={contents.type}>
        {createFormBtn(contents)}
      </FormInterval>
    </StyledForm>
  );
};
export default FormInputs;
