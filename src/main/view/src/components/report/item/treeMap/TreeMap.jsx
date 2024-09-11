import {TreeMap} from 'devextreme-react';
import {Label, Tooltip} from 'devextreme-react/tree-map';
import React, {useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';
import useItemSetting from '../util/hook/useItemSetting';

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
    const returnText =
      `${data.arg} - ${seriesCaption} 
      \n ${seriesCaption}: ${arg.valueText}`;
    return {
      text: returnText
    };
  };
  const handleClick = (e) => {
    if (!interactiveOption.enabled || dataField.dimension.length == 0) return;
    e.node.select(!e.node.isSelected());
    filterTools.setMasterFilterData(e?.node?.data['arg'], () => {}, true);
  };

  return (
    <TreeMap
      ref={dxRef}
      id={id}
      width={'100%'}
      height={'100%'}
      colorizer={treeMapOptions.colorizer}
      dataSource={mart.data.data} // mart
      valueField={seriesNames[0].summaryName}
      labelField='arg'
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

export default React.memo(TreeMapChart, ItemManager.commonPropsComparator);
