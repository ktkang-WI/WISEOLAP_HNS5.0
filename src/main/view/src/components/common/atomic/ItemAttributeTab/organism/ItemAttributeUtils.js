import {DesignerMode} from 'components/config/configType';
import DataFilterModal from
  'components/report/item/pivot/modal/organism/dataFiltering/DataFilterModal';
// eslint-disable-next-line max-len
import DataHighlightModal from 'components/report/item/pivot/modal/organism/datahighlight/DataHighLightModal';
import GridAttributeModal
  from 'components/report/item/pivot/modal/organism/GridAttributeModal';
import VariationValueModal
  from 'components/report/item/pivot/modal/organism/VariationValueModal';
import store from 'redux/modules';
import {
  selectCurrentDesignerMode
} from 'redux/selector/ConfigSelector';
import localizedString from 'config/localization';

const attrCommonProperties = (i, option) => {
  const img = i == 'dataFiltering' ? 'dataHighlight' : i;
  const active = i == 'dataFiltering'? 'dataFilter' : i;

  return {
    id: i,
    label: localizedString[i],
    icon: require(`assets/image/icon/adhoc/${img}.png`),
    active: option === active,
    width: '50%'
  };
};

const selectModalComp = {
  dataHighlight: DataHighlightModal,
  gridAttribute: GridAttributeModal,
  deltaValue: VariationValueModal,
  dataFiltering: DataFilterModal
};

export const pivotOptions = (rootItem, focusedItem, openModal) => {
  const option = focusedItem?.meta.interactiveOption || {};
  const designerMode = selectCurrentDesignerMode(store.getState());
  const itemList =
    ['dataHighlight', 'gridAttribute', 'deltaValue', 'dataFiltering'];
  const isAdHoc = designerMode === DesignerMode['AD_HOC'];

  const pivotOptionItems = itemList.reduce((acc, i) => {
    acc.push(
        {
          ...attrCommonProperties(i, option),
          onClick: () => getOnClick(
              i, openModal, rootItem,
              focusedItem, isAdHoc
          )
        }
    );
    return acc;
  }, []);

  return pivotOptionItems;
};

const initValidation = (i, classificatedItem, isAdHoc) => {
  const adHocCheck = () => {
    const isOk = classificatedItem.items.every((att, idx) => {
      if (i === 'dataHighlight') return att?.mart?.init;
      if (idx === 1) return att.mart.init;
      return true;
    });
    return isOk;
  };

  if (i === 'gridAttribute') return true;
  if (isAdHoc) return adHocCheck(classificatedItem);

  const itemAtt = classificatedItem;
  return itemAtt.mart.init;
};

const setParam = (i, classificatedItem) => {
  // TODO: parametet를 추가하는 부분이 현재 하나 밖에 없지만, 추후 추가 되면 수정예정.
  const item = classificatedItem;
  if (i === 'gridAttribute') {
    return {
      gridAttribute:
        item?.adHocOption?.gridAttribute || item?.meta?.gridAttribute,
      dataField: item?.adHocOption?.dataField || item?.meta?.dataField
    };
  }
  return {};
};

const getOnClick = (i, openModal, rootItem, focusedItem, isAdHoc) => {
  const classificatedItem = isAdHoc ? rootItem : focusedItem;
  const validation = initValidation(i, classificatedItem, isAdHoc);
  if (!validation) return;
  const param = setParam(i, classificatedItem);
  openModal(selectModalComp[i], param);
};
