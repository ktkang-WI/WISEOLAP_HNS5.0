
import _ from 'lodash';

// 객체로 저장된 배열 중복된값 제거로직
// 사용방법 const array = removeDuplicateValue(배열안에 객체 를 삭제할 키로직,배열);
// measures = removeDuplicate(
//   (measure) => measure.summaryType + '_' + measure.name,
//   measures);
export const removeDuplicate = (func, array, returnArray, storedKey) => {
  if (!returnArray) {
    returnArray = [];
    storedKey = [];
    array = _.cloneDeep(array);
  }
  try {
    if (array.length == 0) return returnArray;
    const measure = array.shift();
    const key = func(measure);
    let isInsertingData = false;
    if (returnArray.length === 0) {
      isInsertingData = true;
    } else {
      storedKey.includes(key)?
      isInsertingData = false : isInsertingData = true;
    };
    if (isInsertingData) {
      returnArray.push(measure);
      storedKey.push(key);
    }
    return removeDuplicate(func, array, returnArray, storedKey);
  } catch (error) {
    console.log(error);
    return null;
  }
};
