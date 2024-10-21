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