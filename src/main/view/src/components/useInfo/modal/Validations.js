import localizedString from 'config/localization';
export const getServerValidations = (invalidStatus) => {
  let message = '';
  let result = false;

  if (invalidStatus !== 'Success') {
    message = validationMsgList[invalidStatus];
    result = true;
  } else {
    message = validationMsgList['Success'];
  }


  return {result, message};
};

export const getFrontValidations = (formData) => {
  let message = '';
  let result = false;

  if (formData === undefined) {
    return true;
  }

  const checkPassword = formData.checkPassword;
  const newPassword = formData.newPassword;

  // 길이 제한
  if (checkPassword?.length < 5 || newPassword?.length < 5) {
    message = validationMsgList.lengthValidation;
    result = true;
  } else if (checkPassword?.length > 16 || newPassword?.length > 16) {
    message = validationMsgList.lengthValidation;
    result = true;
  }

  // 아무 입력 안함
  if (Object.keys(formData).length !== 4) {
    message = validationMsgList.allRequired;
    result = true;
  }

  // 변경할 비밀번호 != 비밀번호 확인
  if (checkPassword !== newPassword) {
    message = validationMsgList.notMatchPw;
    result = true;
  }

  // ?

  return {result, message};
};

export const preventInputSpaceBar = (e) => {
  if (e.event.key == ' ') {
    e.event.originalEvent.returnValue = false;
  }
};

export const checkAppliedSpace = (text) => {
  const reg = '\/s/g';
  if (typeof text !== 'string') console.log('문자만 적용 됨.');
  if (text.match(reg)) {
    return true;
  }
};

const validationMsgList = {
  ExceptionCheckCurrPw: localizedString.ExceptionCheckCurrPw,
  ExceptionUpdate: localizedString.ExceptionUpdate,
  Success: localizedString.pwChangeSuccess,
  FailUpdate: localizedString.FailUpdatePw,
  wrongCurrentPw: localizedString.wrongCurrentPw,
  allRequired: localizedString.allRequired,
  notMatchPw: localizedString.notMatchPw,
  lengthValidation: localizedString.lengthValidation,
  dupleCheckPw: '변경할 비밀번호가 기존 비밀번호와 같을 수 없습니다.',
  dupleCheckPwId: '변경할 비밀번호가 아이디 또는 이름과 같을 수 없습니다.'
};
