import {dataFieldTypeOfItemTypeFunc}
  from 'components/report/item/util/dataFieldType';

const getItemObj = (rootItem, fieldsKeys, fieldKeysArr, isAdHoc) => {
  const returnValKeys = [];

  const returnVal =
    fieldsKeys.reduce((acc, item, idx) => {
      const newItem = rootItem.adHocOption?.dataField || item.meta.dataField;
      const key = isAdHoc ? newItem[item] : fieldKeysArr[idx];

      if (newItem.datasetId && !acc[newItem.datasetId]) {
        // datasetId 별로 저장.
        acc[newItem.datasetId] = [];

        returnValKeys.push(newItem.datasetId);
      }

      if (newItem.datasetId) {
        for (let i = 0; i < key.length; i++) {
          if (isAdHoc) {
            acc[newItem.datasetId].push(key[i]);
          } else {
            acc[newItem.datasetId].push(...newItem[key[i]]);
          }
        }
      }
      return acc;
    }, {});

  return returnVal;
};

export const getAppliedDataItem = (rootItem) => {
  const items = rootItem.adHocOption || rootItem.items;
  const isAdHoc = rootItem.adHocOption ? true : false;

  let fieldsKeys = ['row', 'column', 'measure', 'sortByItem'];
  let fieldKeysArr = [];

  if (!isAdHoc) {
    const sameDatasetItems = items.filter((i) =>
      i.meta.dataField.datasetId
    );
    fieldsKeys = sameDatasetItems;

    const itemTypes = sameDatasetItems.map((i) => i.type);

    fieldKeysArr = itemTypes.map((type) => {
      const itemFields = dataFieldTypeOfItemTypeFunc(type);
      itemFields.push('sortByItem');
      return itemFields;
    });
  }

  const item = getItemObj(rootItem, fieldsKeys, fieldKeysArr, isAdHoc);

  return item;
};

const terminateDuple = (onlyUniNmArr) => {
  const nonDuple = new Set(onlyUniNmArr);
  const result = Array.from(nonDuple);

  return result;
};

export const getOnlyUniNm = (dataItems, datasetId) => {
  if (Object.keys(dataItems).length != 0) {
    const onlyUniNmArr = dataItems[datasetId].map((i) => i.uniqueName);
    const terminateDupleOnlyUniNms = terminateDuple(onlyUniNmArr);

    return terminateDupleOnlyUniNms;
  }

  return [];
};
