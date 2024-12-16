
import {
  getDefaultFormat,
  getDefaultFormatRatio
} from 'components/utils/NumberFormatUtility';

export const getFormats = (dataField, adHocOption) => {
  const targets = dataField.measure.concat(dataField.sortByItem);

  let formats;
  if (adHocOption?.gridAttribute) {
    const visibledMeasure = new Set();

    for (const key in adHocOption.gridAttribute) {
      if (adHocOption.gridAttribute[key].gridVisibility) {
        visibledMeasure.add(key);
      }
    }

    formats = targets.reduce((acc, item) => {
      let key = '';
      if (item.summaryType) {
        key = item.summaryType + '_' + item.name;
      } else {
        key = item.name;
      }

      if (visibledMeasure.has(key)) {
        acc.push(item.format);
      }

      return acc;
    }, []);
  } else {
    formats = targets.map((item) => item.format);
  }

  (adHocOption?.variationValues || []).forEach((v) => {
    const target = targets.find((m) => m.fieldId == v.targetId);
    if (v.type == 'absoluteVariation') {
      const format = (target && target.format) || getDefaultFormat();
      formats.push(Object.assign(_.cloneDeep(format),
          {variationValueType: v.type}));
    } else if (v.type.startsWith('Rank')) {
      formats.push(getDefaultFormat());
    } else {
      formats.push(Object.assign(getDefaultFormatRatio(),
          {variationValueType: v.type}));
    }
  });

  return formats;
};

// Excel Cell Download Format 및 Style 적용
// fill 배경 색
// font 글자 색
// value 값
// 접미사를 체크 한다면, text 형식으로 다운로드 되도록 수정
// 접미사를 체크 안한다면, pivot format 형식으로 다운로드 되도록, 소수점 무시
// eslint-disable-next-line max-len
export const getExcelCellFormat = ({backgroundColor, color, formattedValue, formData}) => {
  const excelCellFormat = {};

  if (backgroundColor) {
    excelCellFormat.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: backgroundColor}
    };
  }

  if (color) {
    excelCellFormat.font = {color: {argb: color}};
  }

  if (formData?.suffixEnabled || formData?.variationValueType) {
    excelCellFormat.value = formattedValue;
  }

  return excelCellFormat;
};

export const getPivotFormat = (measureFormat) => {
  const format = {
    type: 'fixedPoint'
  };

  if (measureFormat?.formatType === 'Auto') {
    format.type = 'billions';
  } else if (measureFormat?.formatType === 'General') {
    format.type = 'decimal';
  } else if (measureFormat?.formatType === 'Number') {
    if (measureFormat?.unit === 'Auto') {
      format.type = 'billions';
    } else if (measureFormat?.unit === 'Ones') {
      format.type = 'fixedPoint';
    } else if (measureFormat?.unit === 'Thousands') {
      format.type = 'thousands';
    } else if (measureFormat?.unit === 'Millions') {
      format.type = 'millions';
    } else if (measureFormat?.unit === 'Billions') {
      format.type = 'billions';
    }
  } else if (measureFormat?.formatType === 'Currency') {
    format.type = 'currency';
  } else if (measureFormat?.formatType === 'Scientific') {
    format.type = 'exponential';
  } else if (measureFormat?.formatType === 'Percent') {
    format.type = 'percent';
  }

  return format;
};
