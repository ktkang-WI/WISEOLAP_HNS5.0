
/**
 * @param {string} errorKey
 * 서버 error객체 key와 message mapping.
 * 없는 exception은 입력해서 사용 필요.
 * @return {void}
 */
const errorMsgMapping = {
  SQL: '쿼리가 부적절 합니다. 다시 입력해 주세요.',
  paramList: '매개변수 생성 : '
};

const noMsgObj = (msg, serverMsg) => {
  if (!msg && !serverMsg) {
    return {errorMsg: 'noDisplayMsg', serverDetailMsg: 'noDisplayMsg'};
  } else {
    return {errorMsg: msg, serverDetailMsg: serverMsg};
  }
};

/**
 * @param {string} urlOrErrorCode
 * 에러가 발생한 url, 에러code 중 메시지 출력을 원치 않을 경우 추가.
 * 또는 서버에서 발생한 에러 메세지 커스텀
 * @return {void}
 */
const noMessange = {
  'ERR_NETWORK': noMsgObj(),
  '/login/login': noMsgObj(),
  '/upload/import':
    noMsgObj('파일을 찾을 수 없습니다', 'java.io.IOException: 파일을 찾을 수 없습니다')
};

/**
 * @param {object} error
 * error객체 필요.
 * @return {string}
 */
const ServerErrorUtility = (error) => {
  let errorMsg = '';

  if (noMessange[error.code]) {
    return noMessange[error.code];
  }

  if (noMessange[error?.response?.config?.url]) {
    return noMessange[error?.response?.config?.url];
  }

  const errorData = error.response?.data;
  const whereIs = errorMsgMapping[errorData?.whereIs];
  // mapping
  const errorType = errorData?.code;

  if (errorType?.includes('SQL')) {
    errorMsg = errorMsgMapping['SQL'];

    if (whereIs) {
      errorMsg = whereIs + errorMsgMapping['SQL'];
    }
  } else {
    errorMsg = '시스템 에러 발생. 관리자에게 문의해 주세요.';
  }

  const serverDetailMsg = errorData?.serverMsg;

  if (serverDetailMsg) {
    return {errorMsg, serverDetailMsg};
  } else {
    return {errorMsg};
  }
};
export default ServerErrorUtility;
