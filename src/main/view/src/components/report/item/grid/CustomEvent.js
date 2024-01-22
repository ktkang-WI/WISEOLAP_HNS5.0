import localizedString from 'config/localization';

const useCustomEvent = () => {
  const ribbonConfig = {
  };
  const dataFieldValidator = (item) => {
    const dataField = item.meta.dataField;
    if (!dataField) {
      throw Error(localizedString.noneDataItem);
    }
    const fieldLength = dataField.field.length;

    if (fieldLength == 0) {
      throw Error(localizedString.noneDataField);
    }
  };
  return {
    ribbonConfig,
    dataFieldValidator
  };
};

export default useCustomEvent;
