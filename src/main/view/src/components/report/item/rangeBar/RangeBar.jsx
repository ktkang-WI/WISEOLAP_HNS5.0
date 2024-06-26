import React, {useEffect, useRef} from 'react';
import {Chart} from 'devextreme-react';
import {Tooltip, CommonSeriesSettings, Legend, Series, Point, Label}
  from 'devextreme-react/chart';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {
  seriesOptionDefaultFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {
  directionFormat,
  getSeriesGeneralOption,
  labelFormat,
  overlappingFormat
} from '../chart/seriesOption/SeriesOption';
import useItemSetting from '../util/hook/useItemSetting';
import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';


const RangeBar = ({item, id, setItemExports}) => {
  const dxRef = useRef([]);
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  const {itemTools} = useItemSetting(
      item,
      null,
      [],
      null,
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
    ignoreEmptyPoints,
    pointerMarker} = getSeriesGeneralOption(seriesOptions);
  const overlapping = overlappingFormat(seriesOptions);
  const rangeInfo = _.isEmpty(mart.data) ? {} : mart.data.info.range;

  const interactiveOption = meta.interactiveOption || {};

  const itemExportObject =
  itemExportsObject(id, dxRef, 'RANGE_BAR', mart.data.data);

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

  if (!mart.init) {
    return <></>;
  }


  const customizeLabel = (formData, fieldId) => {
    const dataField =
      seriesOptions.filter((item) => (item.fieldId === fieldId))[0];
    const direction = !dataField ?
      seriesOptionDefaultFormat.pointLabel.direction :
      directionFormat(dataField.pointLabel.direction);
    return (<Label
      visible={true}
      rotationAngle={direction}
      customizeText={(o) => {
        const labelSuffix = generateLabelSuffix(formData);
        o.value = formatNumber(o.value, formData, labelSuffix);
        return !dataField ?
        seriesOptionDefaultFormat.pointLabel.Notation :
        labelFormat(dataField.pointLabel.Notation, o);
      }}
    />)
    ;
  };

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
      });
    } else {
      // 대상 차원이 차원 그룹일 경우
      filterTools.setMasterFilterData(target.series.name, () => {
        if (interactiveOption.mode == 'single') {
          if (target.series.isSelected()) {
            component.clearSelection();
            return;
          }
          component.clearSelection();
        }
        if (target.series.isSelected()) {
          target.series.clearSelection();
        } else {
          target.series.select();
        }
      }, true);
    }
  };

  return (
    <Chart
      dataSource={mart.data.data}
      onPointClick={onPointClick}
      ref={dxRef}
      rotated={meta.useRotate}
      resolveLabelOverlapping={overlapping}
      width="100%"
      height="100%"
      pointSelectionMode={'multiple'}
      palette={meta?.palette?.name}
      seriesSelectionMode={interactiveOption.mode}
    >
      <Legend
        visible={meta.legend.useLegend}
        position={meta.legend.position}
        horizontalAlignment={meta.legend.horizontalAlignment}
        verticalAlignment={meta.legend.verticalAlignment}
        itemTextPosition={meta.legend.itemTextPosition}
      />
      <CommonSeriesSettings
        type="rangebar"
        argumentField='arg'
        minBarSize={2}
        ignoreEmptyPoints={ignoreEmptyPoints}
      >
        <Point visible={pointerMarker} />
      </CommonSeriesSettings>
      {meta.dataField.range1.map((range, index) => {
        const ragne1Name = rangeInfo[range.name];
        const range2Name = rangeInfo[meta.dataField.range2[index].name];
        return (
          <Series
            key={index}
            rangeValue1Field={ragne1Name.summaryName}
            rangeValue2Field={range2Name.summaryName}
            name={ragne1Name.name + '-' + range2Name.name}
          >
            {customizeLabel(mart.formats[index], range.fieldId)}
          </Series>
        );
      })}
      <Tooltip
        customizeTooltip={(e) => {
          e.valueText = ('<b>' +
          e.argumentText.replaceAll('<br/>', ' ') + '</b><br/>' +
          (e.seriesName ? '<b>' + e.seriesName + '</b><br/>' : '') +
          e.valueText);
        }}
        enabled={true}/>
    </Chart>
  );
};

export default React.memo(RangeBar);
