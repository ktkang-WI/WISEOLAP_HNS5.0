import {defaultDimension, defaultAnyField}
  from 'components/report/item/util/martUtilityFactory';
import localizedString from 'config/localization';
import {DataFieldType} from '../util/dataFieldType';
import measureIcon from 'assets/image/icon/dataSource/measure.png';
import fieldIcon from 'assets/image/icon/button/ico_axis.png';
import FieldOptionModal
  from 'components/common/atomic/DataColumnTab/modal/FieldOptionModal';

/**
 * 아이템 객체에 meta 기본 데이터를 세팅합니다.
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateMeta = (item) => {

};

/**
 * 아이템 객체를 기반으로 아이템 조회에 필요한 옵션 생성
 * @param {*} item 옵션을 삽입할 아이템 객체
 */
const generateItem = (item) => {
  const columnsConfig = {
    allowEditing: false
  };
  const columns = item.meta.dataField.field.map((field) => {
    return {
      ...field,
      ...columnsConfig,
      name: field.type === 'MEA' ?
      field.summaryType + '_' + field.name : field.name
    };
  });

  item.mart.data.columns = columns;
};

/**
 * 아이템 객체의 데이터 항목 옵션
 * @return {JSON} dataFieldOption
 */
const getDataFieldOptionChild = () => {
  const dataFieldField = {
    ...defaultAnyField,
    // 열 옵션 설정 버튼 추가
    useButton: true,
    buttonIcon: function(column) {
      return column.type === 'DIM' ? fieldIcon : measureIcon;
    },
    buttonEvent: function(data, openModal) {
      openModal(FieldOptionModal, data);
    }
  };

  const dataFieldSparkline = {
    ...defaultDimension,
    label: localizedString.sparkline,
    placeholder: localizedString.sparklinePlaceholder
  };

  return {
    [DataFieldType.FIELD]: dataFieldField,
    [DataFieldType.SPARKLINE]: dataFieldSparkline
  };
};

/**
 * 차트 커스텀 파라미터 삽입
 * @param {JSON} item 아이템 객체
 * @param {JSON} param 파라미터 정보를 삽입할 객체
 */
const generateParameter = (item, param) => {
  const dataField = item.meta.dataField;
  param.dimension = dataField.field.filter((field) =>
    field.type === 'DIM');
  param.measure = dataField.field.filter((field) =>
    field.type === 'MEA');
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
    'GridLine',
    'BarPallet',
    'BarColorEdit',
    'CellMerging',
    'ColumnHeader',
    'Paging',
    'AutoWrap',
    'GridResiging',
    'HeaderAdd',
    'InputTxt'
  ];
};

/**
 * 속셩 영역 아이템 배열을 반환합니다.
 * @return {Array} attributeItems
 */
const getAttributeItems = () => {
  return [
    'InteractionNoDrillDown',
    'InteractionConfiguration'
  ];
};

const getTabHeaderItems = () => {
  return [];
};

export default {
  generateMeta,
  generateItem,
  generateParameter,
  getDataFieldOptionChild,
  getRibbonItems,
  getAttributeItems,
  getTabHeaderItems
};
