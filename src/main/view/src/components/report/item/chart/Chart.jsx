import DevChart, {
  Legend,
  Series,
  Tooltip
} from 'devextreme-react/chart';
import React from 'react';

const Chart = ({id, adHocOption, item}) => {
  const mart = item ? item.mart : null;
  console.log(adHocOption);

  if (!mart.init) {
    return <></>;
  }

  const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  const seriesNames = mart.data.info.seriesDimensionNames;

  return (
    <DevChart
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      id={id}
    >
      <Legend
        visible={true}
        position='outside'
        horizontalAlignment='right'
        verticalAlignment='top'
      />

      <Tooltip
        enabled={true}
        location='edge'
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
              />
        )
      }

    </DevChart>
  );
};

export default React.memo(Chart);
