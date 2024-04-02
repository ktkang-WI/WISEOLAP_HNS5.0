// import localizedString from 'config/localization';
/**
 * ribbon 버튼에서 사용되는 form 렌더링에 필요한 데이터 소스들을 일괄 리턴합니다.
 * @param {*} item 현재 focus된 아이템
 * @return {JSONArray} formItems
 */

const getFormItems = (item) => {
  return {
    'legend': [
      {
        id: 'on',
        text: 'OFF'
      },
      {
        id: 'off',
        text: 'OFF'
      }
    ]
  };
};

export default {
  getFormItems
};
