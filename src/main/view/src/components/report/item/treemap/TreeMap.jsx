import {TreeMap} from 'devextreme-react';
import {Label, Tooltip} from 'devextreme-react/tree-map';

const TreeMapChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }

  const seriesNames = mart.data.info.seriesMeasureNames;

  return (
    <TreeMap
      id={id}
      width={'100%'}
      height={'100%'}
      dataSource={mart.data.data} // mart
      valueField={seriesNames[0].summaryName}
      labelField='arg'
    >
      <Tooltip
        enabled={true}
      />
      <Label visible={true} />
    </TreeMap>
  );
};

export default TreeMapChart;
