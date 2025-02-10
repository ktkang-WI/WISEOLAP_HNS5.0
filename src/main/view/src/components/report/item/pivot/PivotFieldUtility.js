import {checkVisibleMeasure, getVisibledMeasure} from './FormatUtility';

export const getVariationFields = (adHocOption, dataField, variationValues) => {
  const fields = [];
  const visibledMeasure = adHocOption ? getVisibledMeasure(adHocOption) : [];

  for (const variationValue of variationValues) {
    const targets = [...dataField.measure, ...dataField.sortByItem];
    const target = targets.find((t) => t.fieldId == variationValue.targetId);

    if (!target) continue;

    const field = {
      area: 'data',
      dataField: target.summaryType + '_' + target.name,
      caption: variationValue.name,
      summaryType: 'sum',
      dataType: 'number',
      summaryDisplayMode: variationValue.type,
      visible: checkVisibleMeasure(target, visibledMeasure)
    };

    fields.push(field);
  }

  return fields;
};
