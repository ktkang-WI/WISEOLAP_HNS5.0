import {TreeMap} from 'devextreme-react';
import {Label, Tooltip} from 'devextreme-react/tree-map';

const TreeMapChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

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

export default TreeMapChart;
