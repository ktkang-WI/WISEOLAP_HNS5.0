import {TreeMap} from 'devextreme-react';
import {Label, Tooltip} from 'devextreme-react/tree-map';
import React, {useRef} from 'react';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';
import useItemSetting from '../util/hook/useItemSetting';
import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';

const TreeMapChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const dxRef = useRef();

  const interactiveOption = meta.interactiveOption || {};
  const {filterTools, itemTools} = useItemSetting(
      item,
      null,
      [],
      false,
      {
        selectedItemType: 'REF',
        clearSelection: () => {
          dxRef?.current?.instance?.clearSelection();
        }
      });

  const dataField = itemTools.getDataField();

  useItemExport({
    id,
    ref: dxRef,
    type: ItemType.TREEMAP,
    data: mart?.data?.data,
    setItemExports});

  const seriesNames = mart.data.info.seriesMeasureNames;
  const treeMapOptions = {
    colorizer: {
      type: 'discrete',
      palette: meta?.palette?.colors
    }
  };
  const customizeTooltip = (arg, seriesCaption) => {
    const {data} = arg.node;

    const format = dataField?.measure[0]?.format;

    const labelSuffix = generateLabelSuffix(format);
    const tooltipValue =
      formatNumber(arg.value, format, labelSuffix);

    const returnText =
      `<b>${data.args || data.name}</b>
      \n ${seriesCaption}: ${tooltipValue}`;

    return {
      text: returnText
    };
  };
  const handleClick = (e) => {
    if (!interactiveOption.enabled || dataField.dimension.length == 0) return;
    e.node.select(!e.node.isSelected());
    filterTools.setMasterFilterData(e?.node?.data['args']);
  };

  return (
    <TreeMap
      ref={dxRef}
      id={id}
      width={'100%'}
      height={'100%'}
      colorizer={treeMapOptions.colorizer}
      dataSource={_.cloneDeep(mart.data.data)} // mart
      valueField={'value'}
      idField='id'
      parentField='parentId'
      selectionMode={interactiveOption.enabled && interactiveOption.mode}
      onClick={handleClick}
    >
      <Tooltip
        enabled={true}
        customizeTooltip={(e) => customizeTooltip(e, seriesNames[0].caption)}
      />
      <Label visible={true} />
    </TreeMap>
  );
};

export default React.memo(TreeMapChart, (prev, next) => {
  let result = true;

  if (!_.isEqual(next?.item?.mart, prev?.item?.mart)) {
    result = false;
  } else if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
});
