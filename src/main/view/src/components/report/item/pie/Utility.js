/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {
  const setMeta = (id, data) => {
    if (!item.meta[id]) {
      item.meta[id] = data;
    }
  };

  setMeta('pieChartStyle', 'pie');
  setMeta('labelPosition', 'columns');
};

const generateItem = () => {

};

const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.dimension.concat(dataField.dimensionGroup);
  param.measure = dataField.measure;

  param.dimension = JSON.stringify(param.dimension);
  param.measure = JSON.stringify(param.measure);
};

/**
 * 리본 영역 아이템 배열을 반환합니다.
 * @return {Array} ribbonItems
 */
const getRibbonItems = () => {
  return [
    'CaptionView',
    'NameEdit',
    'DataLabelEdit',
    'LabelPosition',
    'Tooltip',
    'ShowColorLegend',
    'PieChartStyle',
    'Palette',
    'ColorEdit',
    'PointLabel',
    'InputTxt'
  ];
};

export default {
  generateMeta,
  generateItem,
  generateParameter,
  getRibbonItems
};
