import DevChart, {
  Legend,
  Tooltip,
  Series,
  Label
//  ValueAxis
} from 'devextreme-react/chart';
import React from 'react';
import customizeTooltip from '../util/customizeTooltip';
import {selectCurrentDataField}
  from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';

const Chart = ({id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }

  const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  const seriesNames = mart.data.info.seriesDimensionNames;
  const dataFields = useSelector(selectCurrentDataField);
  const formatiOptions = dataFields.measure.map((measure) => ({
    format: measure.format,
    uniqueName: measure.uniqueName
  }));

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
        customizeTooltip={
          (info) => customizeTooltip(info, false, formatiOptions)
        }
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
                  customizeText={
                    (info) => customizeTooltip(info, true, formatiOptions)
                  }
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
