import React, {useEffect, useCallback, useRef} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import {Chart} from 'devextreme-react';
import {Tooltip, CommonSeriesSettings, Legend, Series, Label}
  from 'devextreme-react/chart';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {
  seriesOptionDefaultFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {
  directionFormat,
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

  if (!mart.init) {
    return <></>;
  }
  const dataFields = itemTools.getDataField();
  let seriesOptions = null;
  // TODO:  임시용 코드
  if (dataFields.seriesOptions) seriesOptions = dataFields.seriesOptions;
  const overlapping = overlappingFormat(seriesOptions);
  const rangeInfo = mart.data.info.range;

  const getDataField = useCallback(() => {
    return meta.dataField;
  }, [mart.data]);

  const interactiveOption = meta.interactiveOption;

  let selectedItem = [];
  const {filterItems, clearAllFilter} = useQueryExecute();

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

  // 마스터 필터 관련 useEffect
  useEffect(() => {
    dxRef.current.instance.clearSelection();
  }, [mart.data]);

  useEffect(() => {
    dxRef.current.instance.clearSelection();
    filterItems(item, {});
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled]);

  useEffect(() => {
    dxRef.current.instance.clearSelection();
    clearAllFilter(item);
  }, [interactiveOption.crossDataSource]);

  const getColor = () => {
    let pickedColor = null;

    if (meta.paletteType === 'colorEdit') {
      const palette = meta.colorEdit;

      pickedColor = palette;
    } else {
      pickedColor = meta.palette?.name;
    }
    return pickedColor;
  };

  /**
   * selectedItem 기반으로 필터 정보를 반환합니다.
   * @return {Array} filters
   */
  const getFilter = () => {
    const dataField = getDataField();
    const targetDiemnsion = interactiveOption.targetDimension;
    const dim = dataField.dimension;
    const dimGrp = dataField.dimensionGroup;
    // 선택된 데이터 '차원명': Set 형태로 가공
    const filters = selectedItem.reduce((acc, filter) => {
      if (targetDiemnsion == 'dimension') {
        filter.split('<br/>').reverse().forEach((v, i) => {
          const name = dim[i].uniqueName;
          if (v == '\u2800') {
            v = null;
          }

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
          if (v == '\u2800') {
            v = null;
          }

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
      // 단일 마스터 필터일 경우 초기화
      if (interactiveOption.mode == 'single') {
        selectedItem = [];
        if (target.isSelected()) {
          component.clearSelection();
          filterItems(item, {});
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
        selectedItem = selectedItem.filter((d) => d != target.argument);
      } else {
        component.getAllSeries().forEach((series) => {
          series.getPointsByArg(target.argument).forEach((point) => {
            point.select();
          });
        });
        selectedItem.push(target.argument);
      }
    } else {
      // 대상 차원이 차원 그룹일 경우
      if (interactiveOption.mode == 'single') {
        selectedItem = [];
        if (target.series.isSelected()) {
          component.clearSelection();
          filterItems(item, {});
          return;
        }
        component.clearSelection();
      }
      if (target.series.isSelected()) {
        target.series.clearSelection();
        selectedItem = selectedItem.filter((d) => d != target.series.name);
      } else {
        target.series.select();
        selectedItem.push(target.series.name);
      }
    }
    filterItems(item, getFilter());
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
      palette={getColor()}
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
      />
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
