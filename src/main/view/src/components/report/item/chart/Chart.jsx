import DevChart, {
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Legend,
  Tooltip,
  // Point,
  Series,
  ValueAxis
  // Label,
  // Font
} from 'devextreme-react/chart';
import customizeTooltip from '../util/customizeTooltip';
import {
  pointLabelNotationData,
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
import {generateLabelSuffix, formatNumber}
  from 'components/utils/NumberFormatUtility';
import valueAxisCustomLabel from '../ValueAxisCustomLabel';
import React, {
  useRef
} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import useItemSetting from '../util/hook/useItemSetting';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';
import {findTopAndBottom} from 'components/report/util/TopBottom';

const Chart = ({setItemExports, id, adHocOption, item}) => {
  const dxRef = useRef();

  const {itemTools, filterTools} = useItemSetting(
      item,
      adHocOption,
      [],
      adHocOption,
      {
        selectedItemType: 'REF',
        clearSelection: () => {
          dxRef?.current?.instance?.clearSelection();
        }
      });

  const dataFields = itemTools.getDataField();
  let seriesOptions = null;
  // TODO:  임시용 코드
  if (dataFields.seriesOptions) seriesOptions = dataFields.seriesOptions;

  const {
    auxiliaryAxis,
    ignoreEmptyPoints,
    // pointerMarker,
    reverseView} = getSeriesGeneralOption(seriesOptions);
  const overlapping = overlappingFormat(seriesOptions);

  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  useItemExport({
    id,
    ref: dxRef,
    type: ItemType.CHART,
    data: mart?.data?.data,
    setItemExports});

  if (!mart.init) {
    return <></>;
  }

  const seriesNames = mart.data.info.seriesMeasureNames;
  const interactiveOption = meta.interactiveOption || {};
  const measures = dataFields.measure;
  const seriesMeasurse = mart.data.info.seriesMeasureNames;
  const visibleMeasureIds = Array.from(
      new Set(seriesMeasurse.map(({fieldId}) => fieldId)));
  const labelCache = {};

  const formats = measures.reduce((acc, mea) => {
    if (visibleMeasureIds.includes(mea.fieldId)) {
      acc.push(mea.format);
    }

    return acc;
  }, []);

  const onPointClick = ({target, component}) => {
    if (!interactiveOption.enabled) return;
    // 대상 차원이 차원일 경우
    if (interactiveOption.targetDimension == 'dimension') {
      filterTools.setMasterFilterData(target.argument, () => {
        if (interactiveOption.mode == 'single') {
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
        } else {
          component.getAllSeries().forEach((series) => {
            series.getPointsByArg(target.argument).forEach((point) => {
              point.select();
            });
          });
        }
      }, true);
    } else {
      // 대상 차원이 차원 그룹일 경우
      filterTools.setMasterFilterData(target.series.name, () => {
        if (interactiveOption.mode == 'single') {
          if (target?.series?.isSelected()) {
            component.clearSelection();
            return;
          }
          component.clearSelection();
        }
        if (target?.series?.isSelected()) {
          target?.series?.clearSelection();
        } else {
          target?.series?.select();
        }
      });
    }
  };


  const customizeLabel = (o, formats) => {
    const formData = formats[o.series.tag.math];

    if (!formData) console.error('format 데이터쪽 확인필요이상감지');
    const labelSuffix = generateLabelSuffix(formData);
    const value = o.value;
    o.value = formatNumber(value, formData, labelSuffix);
    const fieldId = o.series.tag.fieldId;
    const dataField = seriesOptions.find((item) => (item.fieldId === fieldId));

    if (dataField.pointLabel.Notation == pointLabelNotationData.topNvalue) {
      const fieldName = o.series.getValueFields()[0];

      if (!labelCache[fieldName]) {
        labelCache[fieldName] = findTopAndBottom(mart.data.data, fieldName,
            dataField.pointLabel.top, dataField.pointLabel.bottom);
      }

      if (!(labelCache[fieldName].topValues.includes(value) ||
      labelCache[fieldName].bottomValues.includes(value))) {
        return {
          visible: false
        };
      }
    }

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

  const palette = meta?.paletteType == 'colorEdit' ?
    meta.colorEdit : meta.palette.name;

  const MarkerTemplate = (target) => {
    const color = target.series.isVisible() ? target.marker.fill : '#888';
    const type = target.series.type;

    let icon = <rect x={0} y={0} width={18} height={10} fill={color}/>;

    if (type.indexOf('bar') >= 0) {
      icon = <rect x={0} y={0} width={25} height={10} fill={color}/>;
    } else if (type == 'scatter' || type == 'burble') {
      icon = <circle cx={10} cy={10} r={5} fill={color}/>;
    } else if (type.indexOf('line') >= 0) {
      icon = <g>
        <rect x={0} y={3.5} width={25} height={3} fill={color}/>
        <circle cx={13} cy={5} r={4} fill={color}/>
      </g>;
    }

    return (
      <svg>
        {icon}
      </svg>
    );
  };

  return (
    <>
      <DevChart
        dataSource={mart.data.data}
        width="100%"
        height="100%"
        customizeLabel={(o) => customizeLabel(o, formats)}
        resolveLabelOverlapping={overlapping}
        palette={palette} // Dev Default blend
        id={id}
        ref={dxRef}
        onPointClick={onPointClick}
        pointSelectionMode={'multiple'}
        rotated={meta.useRotate}
        seriesSelectionMode={interactiveOption.mode}
      >
        <CommonSeriesSettings
          ignoreEmptyPoints={ignoreEmptyPoints}
        >
          {/* <Point visible={pointerMarker} /> */}
        </CommonSeriesSettings>
        <CommonAxisSettings aggregatedPointsPosition="crossTicks" />
        <ArgumentAxis
          inverted={reverseView}
          title={meta.xAxis.axisCutomText}
          label={{
            visible: meta.xAxis.xAxisMark,
            displayMode: 'rotate',
            rotationAngle: meta.xAxis.xAxisInclination
          }}
        />
        <ValueAxis
          autoBreaksEnabled={meta.yAxis.autoBreak}
          maxAutoBreakCount={4}
          name="left"
          position="left"
          title={meta.yAxis.customText} // 사용자정의텍스트
          showZero={meta.yAxis.axisStartToZero} // 제로수준 표시
          visualRangeUpdateMode='keep'
          visualRange={{
            endValue: meta.yAxis.endValue * 1 || undefined,
            startValue: meta.yAxis.startValue * 1 || undefined
          }}
          tickInterval={meta.yAxis.tick || undefined}
          label={{
            visible: meta.yAxis.useAxis, // y축 표시
            customizeText: ({value}) => { // y축 custom Suffix
              if (meta.yAxis.hideNegativeNumber && value < 0) {
                return '';
              }
              return valueAxisCustomLabel(value, meta.yAxis);
            }
          }}
          inverted={reverseView}>
          <Grid visible={true} />
        </ValueAxis>
        {
          auxiliaryAxis ?
          <ValueAxis
            name="right"
            position="right"
            maxAutoBreakCount={4}
            autoBreaksEnabled={meta.extraAxis.autoBreak}
            title={meta.extraAxis.customText} // 사용자정의텍스트
            showZero={meta.extraAxis.axisStartToZero} // 제로수준 표시
            visualRangeUpdateMode='keep'
            visualRange={{
              endValue: meta.extraAxis.endValue * 1 || undefined,
              startValue: meta.extraAxis.startValue * 1 || undefined
            }}
            tickInterval={meta.extraAxis.tick || undefined}
            label={{
              visible: meta.extraAxis.useAxis, // y축 표시
              customizeText: ({value}) => { // y축 custom Suffix
                if (meta.extraAxis.hideNegativeNumber && value < 0) {
                  return '';
                }
                return valueAxisCustomLabel(value, meta.extraAxis);
              }
            }}
            inverted={reverseView}>
            <Grid visible={true} />
          </ValueAxis> : <></>
        }
        <Legend
          visible={meta.legend.useLegend}
          position={meta.legend.position}
          horizontalAlignment={meta.legend.horizontalAlignment}
          verticalAlignment={meta.legend.verticalAlignment}
          itemTextPosition={meta.legend.itemTextPosition}
          markerRender={MarkerTemplate}
        />
        <Tooltip
          enabled={true}
          location='edge'
          customizeTooltip={
            (info) => customizeTooltip(info, false, formats)
          }
        ></Tooltip>
        {
          seriesNames.map(
              (valueField, i) => {
                const option = seriesOptions.find(
                    (series) => series.fieldId == valueField.fieldId
                );

                return <Series
                  axis={getAuxiliaryAxis(valueField.fieldId, seriesOptions)}
                  key={valueField.summaryName + '-' + i}
                  valueField={valueField.summaryName}
                  argumentField='arg'
                  tag={{
                    fieldId: valueField.fieldId,
                    math: visibleMeasureIds.findIndex(
                        (id) => id == valueField.fieldId)
                  }}
                  name={valueField.caption || '\u2800'}
                  type={getSeriesOptionType(valueField.fieldId, seriesOptions)}
                  sizeField={
                    getSeriesOptionType(valueField.fieldId, seriesOptions) ===
                    'bubble' ? valueField.summaryName: null
                  }
                  point={{visible: option?.general?.pointerMarker}}
                >
                  {/* <Label
                    visible={true}
                    backgroundColor='rgba(255, 255, 255, 0.5)'>
                    <Font color="#666" weight={'bold'}/>
                  </Label> */}
                </Series>;
              }
          )
        }
      </DevChart>
    </>
  );
};

export default React.memo(Chart, (prev, next) => {
  if (!_.isEqual(prev.adHocOption, next.adHocOption)) {
    return false;
  }

  return ItemManager.commonPropsComparator(prev, next);
});
