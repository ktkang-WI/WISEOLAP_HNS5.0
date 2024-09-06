
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
      const format = target.format || getDefaultFormat();
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
// TODO: Style 은 추후에 추가
// fill 배경 색
// font 글자 색
// value 값
// eslint-disable-next-line max-len
export const getExcelCellFormat = ({backgroundColor, color, formattedValue}) => ({
  fill: backgroundColor &&
    {type: 'pattern', pattern: 'solid', fgColor: {argb: backgroundColor}},
  font: color && {color: {argb: color}},
  value: formattedValue || undefined
});
