import DevChart, {
  Legend,
  Tooltip,
  Series,
  Label
//  ValueAxis
} from 'devextreme-react/chart';
import React from 'react';
import customizeTooltip from '../util/customizeTooltip';
import {
  selectCurrentDatasets
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentItems
} from 'redux/selector/ItemSelector';
import store from 'redux/modules';

const Chart = ({id, mart}) => {
  if (!mart.init) {
    return <></>;
  }
  const items = selectCurrentItems(store.getState());
  const datasets = selectCurrentDatasets(store.getState());
  console.log('Chart items', items);
  console.log('Chart datasets', datasets);

  const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  const seriesNames = mart.data.info.seriesDimensionNames;

  return (
    <DevChart
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      id={id}
    >
      {/* <ValueAxis min={0} max={99999999999999} /> */}
      <Legend
        visible={true}
        position='outside'
        horizontalAlignment='right'
        verticalAlignment='top'
      />
      <Tooltip
        enabled={true}
        location='edge'
        customizeTooltip={customizeTooltip}
      ></Tooltip>
      {
        seriesNames.map(
            (valueField, i) =>
              <Series
                key={valueField}
                valueField={valueField}
                argumentField='arg'
                name={seriesCaptions[i]}
                type="bar"
              >
                <Label
                  visible={true}
                  position='outside'
                  offset={50}
                  customizeText={(info) => customizeTooltip(info, true)}
                  // backgroundColor='rgba(0, 0, 0, 0)'
                  // font={{color: 'rgb(29, 178, 245)'}}
                />
              </Series>
        )
      }
    </DevChart>
  );
};

export default React.memo(Chart);
