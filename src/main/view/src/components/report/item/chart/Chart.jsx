import DevChart, {
  ArgumentAxis,
  CommonSeriesSettings,
  Grid,
  Point,
  ValueAxis,
  Legend,
  Tooltip,
  Series,
  Label
} from 'devextreme-react/chart';
// import customizeTooltip from '../util/customizeTooltip';
import useQueryExecute from 'hooks/useQueryExecute';
import React, {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {
  overlappingModeData,
  pointLabelDirectionData,
  pointLabelNotationData,
  seriesOptionDefaultFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {selectSeriesOption} from
  'redux/selector/SeriesOption/SeriesOptionSelector';
import _ from 'lodash';

const Chart = ({id, adHocOption, item}) => {
  const dataFields = useSelector(selectSeriesOption);

  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  // const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  // const seriesNames = mart.data.info.seriesDimensionNames;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const interactiveOption = adHocOption ?
  {} : meta.interactiveOption;

  const {filterItems, clearAllFilter} = useQueryExecute();
  const dxRef = useRef();
  let selectedData = [];
  // 마스터 필터 관련 useEffect
  useEffect(() => {
    if (!adHocOption) {
      dxRef.current.instance.clearSelection();
    }
  }, [interactiveOption]);

  useEffect(() => {
    if (!adHocOption) {
      filterItems(item, {});
    }
  }, [interactiveOption.targetDimension, interactiveOption.mode]);

  useEffect(() => {
    if (!adHocOption) {
      clearAllFilter(item);
    }
  }, [interactiveOption.crossDataSource]);

  /**
   * selectedData 기반으로 필터 정보를 반환합니다.
   * @return {Array} filters
   */
  const getFilter = () => {
    const targetDiemnsion = interactiveOption.targetDimension;
    const dim = meta.dataField.dimension;
    const dimGrp = meta.dataField.dimensionGroup;
    // 선택된 데이터 '차원명': Set 형태로 가공
    const filters = selectedData.reduce((acc, filter) => {
      if (targetDiemnsion == 'dimension') {
        filter.split('<br/>').reverse().forEach((v, i) => {
          const name = dim[i].uniqueName;
          if (acc[name]) {
            acc[name].add(v);
          } else {
            acc[name] = new Set([v]);
          }
        });
      } else {
        filter.split('-').forEach((v, i) => {
          if (dimGrp.length <= i) return;
          const name = dimGrp[i].uniqueName;
          if (acc[name]) {
            acc[name].add(v);
          } else {
            acc[name] = new Set([v]);
          }
        });
      }
      return acc;
    }, {});
    // Set Array로 변환
    for (const filter in filters) {
      if (filters[filter]) {
        filters[filter] = [...filters[filter]];
      }
    }
    return filters;
  };

  const onPointClick = ({target, component}) => {
    if (!interactiveOption.enabled) return;
    // 대상 차원이 차원일 경우
    if (interactiveOption.targetDimension == 'dimension') {
      // 단일 마스터 필터일 경우 초기화
      if (interactiveOption.mode == 'single') {
        selectedData = [];
        if (target.isSelected()) {
          component.clearSelection();
          return;
        }
        component.clearSelection();
      }
      if (target.isSelected()) {
        component.getAllSeries().forEach((series) => {
          series.getPointsByArg(target.argument).forEach((point) => {
            point.clearSelection();
          });
        });
        selectedData = selectedData.filter((d) => d != target.argument);
      } else {
        component.getAllSeries().forEach((series) => {
          series.getPointsByArg(target.argument).forEach((point) => {
            point.select();
          });
        });
        selectedData.push(target.argument);
      }
    } else {
      // 대상 차원이 차원 그룹일 경우
      if (target.series.isSelected()) {
        target.series.clearSelection();
        selectedData = selectedData.filter((d) => d != target.series.name);
      } else {
        target.series.select();
        selectedData.push(target.series.name);
      }
    }
    filterItems(item, getFilter());
  };

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
      ref={dxRef}
      onPointClick={onPointClick}
      pointSelectionMode={'multiple'}
      seriesSelectionMode={interactiveOption.mode}
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
        customizeTooltip={
          (info) => customizeTooltip(info, false, mart.formats)
        }
      ></Tooltip>
      {
        seriesNames.map(
            (valueField, i) =>
              <Series
                axis={getAuxiliaryAxis(valueField.fieldId)}
                key={valueField.summaryName+'-'+i}
                valueField={valueField.summaryName}
                argumentField='arg'
                tag={{
                  fieldId: valueField.fieldId,
                  math: Math.floor(i / mart.seriesLength)}}
                name={valueField.caption}
                type={getSeriesOptionType(valueField.fieldId)}
                sizeField={
                  getSeriesOptionType(valueField.fieldId) ==='bubble' ?
                  valueField.summaryName: null
                }
              >
                <Label
                  visible={true}
                  position='outside'
                  offset={50}
                  customizeText={
                    (info) => customizeTooltip(info, true, mart.formats)
                  }
                />
              </Series>
        )
      }
    </DevChart>
  );
};

const propsComparator = (prev, next) => {
  return _.isEqual(prev.item.mart, next.item.mart) &&
  _.isEqual(prev.item.meta.interactiveOption,
      next.item.meta.interactiveOption) &&
  _.isEqual(prev.adHocOption, next.adHocOption);
};

export default React.memo(Chart, propsComparator);
