/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 * @param {*} data 조회된 데이터
 */
const generateItem = (item, data) => {
  const columnsConfig = {
    allowEditing: false
  };
  const columns = item.meta.dataField.field.map((field) => {
    return {
      ...field,
      ...columnsConfig
    };
  });

  item.mart.data.columns = columns;
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.field.filter((field)=>field.type === 'DIM');
  param.measure = dataField.field.filter((field)=>field.type === 'MEA');

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
};

export default {
  generateItem,
  generateParameter
};
