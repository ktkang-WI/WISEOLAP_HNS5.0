import test from 'components/validateTest/test';
import {Validator} from 'devextreme-react';
import {AsyncRule, CompareRule, EmailRule} from 'devextreme-react/form';

const state = {
  password: '',
  isCheckBtnClick: false
};

const asyncValidationEmail = (params) => {
  const invalidEmail = 'test@dx-email.com';
  const value = params.value;
  return new Promise((resolve) => {
    resolve(value !== invalidEmail);
  });
};

const asyncValidationPassword = (params) => {
  const value = params.value;
  const specialPattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
  if (value.length > 15 || value.length < 8) {
    return (
      new Promise((resolve) => {
        resolve({isValid: false, message: '8자 이상, 15자 이하로 입력해 주세요.'});
      })
    );
  } else if (!specialPattern.test(value)) {
    return (
      new Promise((resolve) => {
        resolve({isValid: false, message: '특수문자를 하나 이상 포함해 주세요.'});
      })
    );
  } else {
    state.password = value;
    return (
      new Promise((resolve) => {
        resolve({isValid: true});
      })
    );
  }
};

const asyncValidationId = (params) => {
  const value = params.value;
  const specialPattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
  if (specialPattern.test(value)) {
    return (
      new Promise((resolve) => {
        resolve({isValid: false, message: 'ID에 특수문자를 입력할 수 없습니다.'});
      })
    );
  } else {
    return ( // 서버에서 아이디 중복 검사
      new Promise((resolve) => {
        resolve({isValid: test(value), message: '중복 ID'});
      })
    );
  }
};

// const dupleIdCheck = (e) => {
//   const result = e.validationGroup.validate();
//   if (result.isValid) {
//     // Submit values to the server
//   }
// };

const passwordComparison = () => {
  return state.password;
};

const asyncValidationPasswordCheck = (params) => {
  const value = params.value;
  return new Promise((resolve) => {
    resolve(value === state.password);
  });
};

// const checkBtn = {
//   text: 'Check',
//   onClick: dupleIdCheck
// };

const InputElements = () => {
  return {
    login: {
      type: 'login',
      inputs: ['ID', 'Password'],
      labelMode: 'floating',
      passwordLabel: 'Password',
      textLabel: 'text',
      mode: {
        Password: 'Password'
      },
      onKeyDown: (e) => {
        if (e.event.key == ' ') {
          e.event.originalEvent.returnValue = false;
        }
      }
    },
    register: {
      type: 'register',
      inputs: ['ID', 'Password', 'PasswordCheck', 'Email', 'Company'],
      labelMode: 'floating',
      passwordLabel: 'Password',
      textLabel: 'text',
      mode: {
        Password: 'Password'
      },
      onKeyDown: (e) => {
        if (e.event.key == ' ') {
          e.event.originalEvent.returnValue = false;
        }
      },
      emailRule:
        <Validator>
          <EmailRule message="이메일 형식에 맞지 않습니다." />
          <AsyncRule
            validationCallback={asyncValidationEmail}
          />
        </Validator>,
      passwordRule:
        <Validator>
          <AsyncRule
            validationCallback={asyncValidationPassword}
          />
        </Validator>,
      passwordCheckRule:
        <Validator>
          <CompareRule
            message='비밀번호가 다릅니다.'
            comparisonTarget={passwordComparison}
          />
          <AsyncRule
            validationCallback={asyncValidationPasswordCheck}
          />
        </Validator>,
      idCheckRule:
        <Validator>
          <AsyncRule
            validationCallback={asyncValidationId}
          />
        </Validator>
    }
  };
};
export default InputElements;
