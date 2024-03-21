import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {TreeMap} from 'devextreme-react';
import {Label, Tooltip} from 'devextreme-react/tree-map';
import React, {useEffect, useRef} from 'react';

const TreeMapChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'TREEMAP', mart.data.data);

  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

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
    >
      <Tooltip
        enabled={true}
        customizeTooltip={(e) => customizeTooltip(e, seriesNames[0].caption)}
      />
      <Label visible={true} />
    </TreeMap>
  );
};

const propsComparator = (prev, next) => {
  let result = true;
  if (!_.isEqual(prev.item.mart, next.item.mart)) {
    result = false;
  }
  if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

export default React.memo(TreeMapChart, propsComparator);
