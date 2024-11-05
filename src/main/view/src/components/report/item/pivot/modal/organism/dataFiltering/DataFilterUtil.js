import {DesignerMode} from 'components/config/configType';
import localizedString from 'config/localization';

// 유효성 검사.
export const getValidation = (formData) => {
  let alertMsg = '';
  // 필수 적용 항목 (측정값, 차원 둘 다)
  const requireItems = [
    'dataItem',
    'condition',
    'valueFrom',
    'valueTo'
  ];

  if (formData.condition !== 'Between') {
    requireItems.pop();
  }

  // const noValueRequireItems = requireItems.findIndex((i) => !formData[i]);
  const noValueRequireItems =
    requireItems.findIndex(
        (i) => formData[i] === undefined || formData[i] === null
    );

  if (noValueRequireItems > -1) {
    alertMsg = localizedString.highlightInputEssentialValueMsg;

    return alertMsg;
  }

  if (formData.condition) {
    alertMsg = requireItems.reduce((acc, i) => {
      if (['dataItem', 'condition'].includes(i)) return acc;

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

  result.measures =
    reportItem.dataField.measure
        .filter((mea) => mea.summaryType !== 'SUBQ')
        .map((mea) => mea.name);

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

  result.idx = measureNames.findIndex((measure) =>
    measure == formData.dataItem
  );
  result.flag = 'value';
  return result;
};

export const getDetailInfo = (FilteredData, rootItem) => {
  const measures = rootItem?.adHocOption?.dataField?.measure || [];
  const matchedMeasure = measures.find(
      (measure) => measure.name === FilteredData.dataItem
  );

  return {
    ...FilteredData,
    uniqueName: matchedMeasure.uniqueName,
    summaryType: matchedMeasure.summaryType
  };
};


