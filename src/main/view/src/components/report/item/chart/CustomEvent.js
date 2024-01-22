import localizedString from 'config/localization';

const useCustomEvent = () => {
  const ribbonConfig = {
  };

  const dataFieldValidator = (item) => {
    const dataField = item.meta.dataField;
    if (!dataField) {
      throw Error(localizedString.noneDataItem);
    }
    const dimensionLength =
      dataField.dimension.length + dataField.dimensionGroup;
    const measureLength = dataField.measure.length;

    if (dimensionLength == 0) {
      throw Error(localizedString.noneDimensionItem);
    }

    if (measureLength == 0) {
      throw Error(localizedString.noneMeasureItem);
    }
  };

  return {
    ribbonConfig,
    dataFieldValidator
  };
};

export default useCustomEvent;
