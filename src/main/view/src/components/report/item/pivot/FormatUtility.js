
import {
  getDefaultFormat,
  getDefaultFormatRatio
} from 'components/utils/NumberFormatUtility';

export const getVisibledMeasure = (adHocOption) => {
  const visibledMeasure = new Set();
  if (adHocOption?.gridAttribute) {
    for (const key in adHocOption.gridAttribute) {
      if (adHocOption.gridAttribute[key].gridVisibility) {
        visibledMeasure.add(key);
      }
    }
  }

  return visibledMeasure;
};

export const checkVisibleMeasure = (item, visibledMeasure) => {
  if (visibledMeasure.size === 0) {
    return true;
  }
  let key = '';
  if (item.summaryType) {
    key = item.summaryType + '_' + item.name;
  } else {
    key = item.name;
  }

  return visibledMeasure.has(key);
};

export const getFormats = (dataField, adHocOption) => {
  const targets = dataField.measure.concat(dataField.sortByItem);
  const visibledMeasure = getVisibledMeasure(adHocOption);

  let formats;

  if (adHocOption?.gridAttribute) {
    formats = targets.reduce((acc, item) => {
      if (checkVisibleMeasure(item, visibledMeasure)) {
        acc.push(item.format);
      } else {
        acc.push(getDefaultFormat());
      }
      return acc;
    }, []);
  } else {
    formats = targets.map((item) => item.format);
  }

  (adHocOption?.variationValues || []).forEach((v) => {
    const target = targets.find((m) => m.fieldId == v.targetId &&
    checkVisibleMeasure(m, visibledMeasure));
    if (target) {
      if (v.type == 'absoluteVariation') {
        const format = target.format || getDefaultFormat();
        formats.push(Object.assign(_.cloneDeep(format),
            {variationValueType: v.type}));
      } else if (v.type.startsWith('Rank')) {
        formats.push(getDefaultFormat());
      } else {
        formats.push(Object.assign(getDefaultFormatRatio(),
            {variationValueType: v.type}));
      }
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
  const {
    formatType,
    precision,
    suffix,
    suffixEnabled,
    unit,
    useDigitSeparator
  } = formData;

  const unitNum = {
    O: 1,
    K: 1000,
    M: 1000000,
    B: 1000000000
  };
  // 기본 셀 속성 설정
  const cellFormat = {
    value: formattedValue,
    alignment: {horizontal: 'right'}
  };

  let fUnit = unit;
  const fCurrency = '₩';

  const fType = formatType ? formatType : 'Number';

  // 배경색 적용
  if (backgroundColor) {
    cellFormat.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {argb: backgroundColor}
    };
  }
  // 글자색 적용
  if (color) {
    cellFormat.font = {color: {argb: color}};
  }

  let numberFormat = '0';
  // 천단위 구분자 적용
  const separatorFormat = () => {
    if (useDigitSeparator) {
      numberFormat = '#,##0';
    } else {
      numberFormat = '0';
    }
  };
  // 소수점 자리수 적용
  const precisionFormat = () => {
    if (precision > 0) {
      numberFormat += '.';
      for (let i = 0; i < precision; i++) {
        numberFormat += '0';
      }
    }
  };

  // 단위 접미사 적용
  const suffixFormat = () => {
    switch (fUnit) {
      case 'Ones':
        cellFormat.value = cellFormat.value/unitNum['O'];
        numberFormat += !suffixEnabled ? '' :
            suffix?.O ? ` "${suffix.O}"` : '';
        break;
      case 'Thousands':
        cellFormat.value = cellFormat.value/unitNum['K'];
        numberFormat += !suffixEnabled ? ' "K"' :
            suffix?.K ? ` "${suffix.K}"` : ' "K"';
        break;
      case 'Millions':
        cellFormat.value = cellFormat.value/unitNum['M'];
        numberFormat += !suffixEnabled ? ' "M"' :
            suffix?.M ? ` "${suffix.M}"` : ' "M"';
        break;
      case 'Billions':
        cellFormat.value = cellFormat.value/unitNum['B'];
        numberFormat += !suffixEnabled ? ' "B"' :
            suffix?.B ? ` "${suffix.B}"` : ' "B"';
        break;
    }
  };

  const setAutoUnit = () => {
    const valueText = formattedValue.toString().replace('-', '').split('.')[0];
    if (valueText.length >= 10) {
      fUnit = 'Billions';
    } else if (valueText.length < 10 && valueText.length >= 7) {
      fUnit = 'Millions';
    } else if (valueText.length < 7 && valueText.length >= 4) {
      fUnit = 'Thousands';
    } else {
      fUnit = 'Ones';
    }
    if (_unit === undefined) {
      fUnit = 'Ones';
    }
  };

  // 숫자 서식 설정
  const fn = {
    Auto: function(_v, _u) {
      separatorFormat();
      precisionFormat();
      setAutoUnit();
      suffixFormat();
      numberFormat = fCurrency + numberFormat;
    },
    General: function(_v) {
      numberFormat = '0';
    },
    Number: function(_v) {
      separatorFormat();
      precisionFormat();
      suffixFormat();
    },
    Currency: function(_v, _u) {
      separatorFormat();
      precisionFormat();
      suffixFormat();
      numberFormat = fCurrency + numberFormat;
    },
    Scientific: function(_v, _u) {
      separatorFormat();
      precisionFormat();
      cellFormat.value = _v.toExponential(precision).toUpperCase();
    },
    Percent: function(_v, _u,) {
      separatorFormat();
      precisionFormat();
      numberFormat = numberFormat + '%';
    }
  };

  fn[fType](formattedValue);

  cellFormat.numFmt = numberFormat;

  if (isNaN(cellFormat.value)) {
    cellFormat.value = '';
    cellFormat.numFmt = '';
  }

  return cellFormat;
};
// eslint-disable-next-line max-len
// export const getExcelCellFormat = ({backgroundColor, color, formattedValue, formData}) => {
//   const excelCellFormat = {};

//   if (backgroundColor) {
//     excelCellFormat.fill = {
//       type: 'pattern',
//       pattern: 'solid',
//       fgColor: {argb: backgroundColor}
//     };
//   }

//   if (color) {
//     excelCellFormat.font = {color: {argb: color}};
//   }

//   if (formData?.suffixEnabled || formData?.variationValueType) {
//     excelCellFormat.value = formattedValue;
//   }

//   return excelCellFormat;
// };

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
