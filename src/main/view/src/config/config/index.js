import configJson from './config.json';

/**
 * 전체 설정 json 반환 (사용 지양)
 * @return {JSON} 설정 json
 */
export const getConfigAll = () => {
  return configJson;
};

/**
 * getConfig(설정 키값)
 * @param {string} keyStr
 * @return {Object} 설정값
 */
export const getConfig = (keyStr) => {
  const keys = keyStr.split('.');
  let value = configJson;

  for (let i = 0; i < keys.length; i++) {
    if (typeof value == 'undefined') {
      break;
    }

    value = value[keys[i]];
  }

  return value;
};
