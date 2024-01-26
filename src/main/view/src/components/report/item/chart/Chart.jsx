import DevChart, {
  ArgumentAxis,
  CommonSeriesSettings,
  Grid,
  Legend,
  Point,
  Series,
  ValueAxis
} from 'devextreme-react/chart';
import React from 'react';
import {
  seriesOptionDefaultFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {
  directionFormat,
  getAuxiliaryAxis,
  getSeriesGeneralOption,
  getSeriesOptionType,
  labelFormat,
  overlappingFormat
} from './seriesOption/SeriesOption';

const Chart = ({id, dataFields, adHocOption, item}) => {
  let seriesOptions = null;
  if (dataFields.seriesOptions) seriesOptions = dataFields.seriesOptions;
  const {
    auxiliaryAxis,
    ignoreEmptyPoints,
    pointerMarker,
    reverseView} = getSeriesGeneralOption(seriesOptions);
  const overlapping = overlappingFormat(seriesOptions);
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }

  const seriesNames = mart.data.info.seriesMeasureNames;

  const customizeLabel = (o) => {
    const fieldId = o.series.tag.fieldId;
    const dataField =
      seriesOptions.filter((item) => (item.fieldId === fieldId))[0];
    const label = !dataField ?
      seriesOptionDefaultFormat.pointLabel.Notation :
      labelFormat(dataField.pointLabel.Notation, o);
    const direction = !dataField ?
      seriesOptionDefaultFormat.pointLabel.direction :
      directionFormat(dataField.pointLabel.direction);
    return {
      rotationAngle: direction,
      visible: label ? true : false,
      customizeText(e) {
        return label;
      }
    };
  };

  return (
    <DevChart
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      customizeLabel={customizeLabel}
      resolveLabelOverlapping={overlapping}
      id={id}
    >
      <CommonSeriesSettings
        ignoreEmptyPoints={ignoreEmptyPoints}
      >
        <Point visible={pointerMarker} />
      </CommonSeriesSettings>
      <ArgumentAxis
        inverted={reverseView} />
      <ValueAxis
        name="left"
        position="left"
        inverted={reverseView}>
        <Grid visible={true} />
      </ValueAxis>
      {
        auxiliaryAxis ?
        <ValueAxis
          name="right"
          position="right"
          inverted={reverseView}>
          <Grid visible={true} />
        </ValueAxis> : <></>
      }
      <Legend
        visible={true}
        position='outside'
        horizontalAlignment='right'
        verticalAlignment='top'
      />
      {
        seriesNames.map(
            (valueField, i) =>
              <Series
                axis={getAuxiliaryAxis(valueField.fieldId, seriesOptions)}
                key={valueField.summaryName+'-'+i}
                valueField={valueField.summaryName}
                argumentField='arg'
                tag={{fieldId: valueField.fieldId}}
                name={valueField.caption}
                type={getSeriesOptionType(valueField.fieldId, seriesOptions)}
                sizeField={
                  getSeriesOptionType(valueField.fieldId, seriesOptions) ===
                  'bubble' ? valueField.summaryName: null
                }
              >
              </Series>
        )
      }
    </DevChart>
  );
};

export default React.memo(Chart);
