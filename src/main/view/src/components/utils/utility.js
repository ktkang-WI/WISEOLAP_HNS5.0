
import _ from 'lodash';
// 객체로 저장된 배열 중복된값 제거로직
// 사용방법 const array = removeDuplicateValue(배열안에 객체 를 삭제할 키로직,배열);
// measures = removeDuplicate(
//   (measure) => measure.summaryType + '_' + measure.name,
//   measures);
export const removeDuplicate = (func, array, returnArray, prevKey) => {
  if (!returnArray) {
    returnArray = [];
    array = _.cloneDeep(array);
  }
  try {
    if (array.length == 0) return returnArray;
    const measure = array.shift();
    const key = func(measure);
    let isInsertingData = false;
    // 키를 생성해야함
    if (!prevKey) {
      isInsertingData = true;
    } else {
      prevKey === key ?
      isInsertingData = false : isInsertingData = true;
    };
    if (isInsertingData) returnArray.push(measure);
    return removeDuplicate(func, array, returnArray, key);
  } catch (error) {
    console.log(error);
    return null;
  }
};
