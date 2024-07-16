import {DesignerMode} from 'components/config/configType';
import localizedString from 'config/localization';

// 유효성 검사.
export const getValidation = (formData) => {
  let alertMsg = '';
  // 필수 적용 항목 (측정값, 차원 둘 다)
  let requireItems = [
    'dataItem',
    'condition',
    'valueFrom',
    'valueTo'
  ];

  // 기존 데이터하이라이트를 만들었던 보고서는 type이 없어 null(측정값 하이라이트).
  if (!formData.type || formData.type === 'measure' ) {
    if (formData.condition !== 'Between') {
      requireItems.pop();
    }
  }

  if (formData.type === 'dimension') {
    requireItems = ['dataItem'];
  }

  const noValueRequireItems = requireItems.findIndex((i) => !formData[i]);

  if (noValueRequireItems > -1) {
    alertMsg = localizedString.highlightInputEssentialValueMsg;

    return alertMsg;
  }

  if (formData.condition) {
    alertMsg = requireItems.reduce((acc, i) => {
      if (['type', 'dataItem', 'condition'].includes(i)) return acc;

      if (i == 'valueTo') {
        if (!formData[i]) {
          return acc = localizedString.highlightBetweenValueEssentialMsg;
        }

        if (Number(formData.valueFrom) > Number(formData.valueTo)) {
          return acc = localizedString.highlightBetweenValueCompareMsg;
        }
      }

      if ((i == 'valueFrom' || i == 'valueTo') && isNaN(Number(formData[i]))) {
        return acc = localizedString.highlightOnlyNumberMsg;
      }

      return acc;
    }, '');

    return alertMsg;
  }
};

export const getNames = (reportType, rootItem, selectedItem) => {
  const result = {measures: [], dimensions: {}};
  let reportItem = rootItem.adHocOption;

  if (reportType === DesignerMode['DASHBOARD']) {
    reportItem = selectedItem.meta;
  }

  result.measures = reportItem.dataField.measure.map((mea) => mea.name);

  const rows = reportItem.dataField.row.map((row) => row.name);
  const cols = reportItem.dataField.column.map((col) => col.name);

  result.dimensions.rows = rows;
  result.dimensions.cols = cols;

  return result;
};

// setMeta
export const setMeta = (item, key, value) => {
  return {
    ...item,
    meta: {
      ...item.meta,
      [key]: value
    }
  };
};

export const getIdxAndFlag = (formData, reportType, rootItem, selectedItem) => {
  const measureNames = getNames(reportType, rootItem, selectedItem).measures;
  const result = {
    idx: -1,
    flag: ''
  };

  if (formData.type === 'measure') {
    result.idx = measureNames.findIndex((measure) =>
      measure == formData.dataItem
    );

    result.flag = 'value';
  } else {
    const rows = getNames(reportType, rootItem, selectedItem).dimensions.rows;
    const cols = getNames(reportType, rootItem, selectedItem).dimensions.cols;

    result.idx = rows.findIndex((row) =>
      row == formData.dataItem
    );

    result.flag = 'row';

    if (result.idx == -1) {
      result.idx = cols.findIndex((col) =>
        col == formData.dataItem
      );

      result.flag = 'column';
    }
  }

  return result;
};
