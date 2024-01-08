import DevChart, {
  ArgumentAxis,
  CommonSeriesSettings,
  Grid,
  Legend,
  Point,
  Series,
  Tooltip,
  ValueAxis
} from 'devextreme-react/chart';
import React from 'react';
import {useSelector} from 'react-redux';
import {
  overlappingModeData,
  pointLabelDirectionData,
  pointLabelNotationData,
  seriesOptionDefaultFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {selectSeriesOption} from
  'redux/selector/SeriesOption/SeriesOptionSelector';

const Chart = ({id, item}) => {
  const dataFields = useSelector(selectSeriesOption);

  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }

  // const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  // const seriesNames = mart.data.info.seriesDimensionNames;
  const seriesNames = mart.data.info.seriesMeasureNames;

  const getAuxiliaryAxis = (fieldId) => {
    if (!dataFields) return 'left';
    const selectedDataField =
      dataFields.filter((item) => item.fieldId === fieldId)[0];
    if (!selectedDataField) return 'left';

    return selectedDataField.general.auxiliaryAxis ? 'right' : 'left';
  };
  const isUsedAuxiliaryAxis = () => {
    const auxiliaryAxis =
      dataFields.filter((item) => item.general.auxiliaryAxis === true);
    if (auxiliaryAxis.length === 0) return false;
    return true;
  };

  const getSeriesGeneralOption = () => {
    const auxiliaryAxis =
     !dataFields ? false : isUsedAuxiliaryAxis();
    const ignoreEmptyPoints =
     !dataFields ? false : dataFields[0].general.ignoreEmptyPoints;
    const pointerMarker =
     !dataFields ? false : dataFields[0].general.pointerMarker;
    const reverseView =
     !dataFields ? false : dataFields[0].general.reverseView;

    return {
      auxiliaryAxis,
      ignoreEmptyPoints,
      pointerMarker,
      reverseView
    };
  };

  const getSeriesOptionType = (fieldId) => {
    let selectedSeriesOption = null;
    dataFields.forEach((item) => {
      if (item.fieldId === fieldId) {
        selectedSeriesOption = item;
      };
    });

    if (selectedSeriesOption == null) return 'bar';

    return selectedSeriesOption.type;
  };

  const overlappingFormat = () => {
    let format = '';
    const overlapping = !dataFields ?
      overlappingModeData.default :
      dataFields[0].pointLabel.overlayMode;
    if (overlapping === overlappingModeData.default) {
      format = 'none';
    } else if (overlapping === overlappingModeData.hidden) {
      format = 'hide';
    } else if (overlapping === overlappingModeData.overlappingLabelReLocate) {
      format = 'stack';
    }
    return format;
  };

  const labelFormat = (Notation, valueObject) => {
    let format = '';
    if (pointLabelNotationData.argument === Notation) {
      format = `${valueObject.argument}`;
    } else if (pointLabelNotationData.measureName === Notation) {
      format = `${valueObject.seriesName}`;
    } else if (pointLabelNotationData.value === Notation) {
      format = `${valueObject.value}`;
    } else if (pointLabelNotationData.argumentMeasureName === Notation) {
      format = `${valueObject.argument} (${valueObject.seriesName})`;
    } else if (pointLabelNotationData.measureNameValue === Notation) {
      format = `${valueObject.value} (${valueObject.seriesName})`;
    } else if (pointLabelNotationData.argumentMeasureNameValue === Notation) {
      format = `${valueObject.value} 
      ${valueObject.argument} (${valueObject.seriesName})`;
    }

    return format;
  };

  const directionFormat = (direction) => {
    let format = 0;

    if (pointLabelDirectionData.left === direction) {
      format = -90;
    } else if (pointLabelDirectionData.right === direction) {
      format = 90;
    }

    return format;
  };

  const customizeLabel = (o) => {
    const fieldId = o.series.tag.fieldId;
    const dataField = dataFields.filter((item) =>
      (item.fieldId === fieldId))[0];
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
    return null;
  };

  return (
    <DevChart
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      customizeLabel={customizeLabel}
      resolveLabelOverlapping={overlappingFormat()}
      id={id}
    >
      <CommonSeriesSettings
        ignoreEmptyPoints={getSeriesGeneralOption().ignoreEmptyPoints}
      >
        <Point visible={getSeriesGeneralOption().pointerMarker} />
      </CommonSeriesSettings>
      <ArgumentAxis
        inverted={getSeriesGeneralOption().reverseView} />
      <ValueAxis
        name="left"
        position="left"
        inverted={getSeriesGeneralOption().reverseView}>
        <Grid visible={true} />
      </ValueAxis>
      {
        getSeriesGeneralOption().auxiliaryAxis ?
        <ValueAxis
          name="right"
          position="right"
          inverted={getSeriesGeneralOption().reverseView}>
          <Grid visible={true} />
        </ValueAxis> : <></>
      }
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
                axis={getAuxiliaryAxis(valueField.fieldId)}
                key={valueField.summaryName+'-'+i}
                valueField={valueField.summaryName}
                argumentField='arg'
                tag={{fieldId: valueField.fieldId}}
                name={valueField.caption}
                type={getSeriesOptionType(valueField.fieldId)}
                sizeField={
                  getSeriesOptionType(valueField.fieldId) ==='bubble' ?
                  valueField.summaryName: null
                }
              />
        )
      }

    </DevChart>
  );
};

export default React.memo(Chart);
