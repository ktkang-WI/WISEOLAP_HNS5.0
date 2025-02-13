import {checkVisibleMeasure, getVisibledMeasure} from './FormatUtility';

export const getVariationFields = (
    adHocOption, dataField, variationValues, item
) => {
  const fields = [];
  const option = adHocOption ? adHocOption : item.meta;
  const visibledMeasure = getVisibledMeasure(option);

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
