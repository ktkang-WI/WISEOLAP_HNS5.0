import React, {useEffect, useCallback, useRef} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import {Chart} from 'devextreme-react';
import {Tooltip, CommonSeriesSettings, SeriesTemplate, Legend}
  from 'devextreme-react/chart';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';


const Timeline = ({item, id, setItemExports}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  const {alert} = useModal();

  if (!mart.init) {
    return <></>;
  }

  // 날짜 형식 데이터가 아닌 경우
  if (mart.data?.data &&
    (isNaN(mart.data.data[0].start) || mart.data.data[0].start.length != 8 ||
    isNaN(mart.data.data[0].end) || mart.data.data[0].end.length != 8)) {
    alert(localizedString.invalidDate);
    return <></>;
  }

  const getDataField = useCallback(() => {
    return meta.dataField;
  }, [mart.data]);

  const interactiveOption = meta.interactiveOption;

  let selectedItem = [];
  const {filterItems, clearAllFilter} = useQueryExecute();

  const dxRef = useRef([]);

  useItemExport({
    id,
    ref: dxRef,
    type: ItemType.TIMELINE,
    data: mart?.data?.data,
    setItemExports});

  useItemExport({
    id,
    ref,
    type: ItemType.TIMELINE,
    data: mart?.data?.data,
    setItemExports});

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

  const stringToDate = useCallback((str) => {
    // 문자열에서 연, 월, 일 추출
    const year = str.substring(0, 4);
    const month = str.substring(4, 6);
    const day = str.substring(6, 8);

    // Date 객체 생성
    return new Date(year, month - 1, day);
  }, []);

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

  const getData = useCallback(() => {
    return mart.data.data.map((row) => {
      return {
        ...row,
        start: stringToDate(row.start),
        end: stringToDate(row.end)
      };
    });
  }, [mart.data]);
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
      dataSource={getData()}
      onPointClick={onPointClick}
      ref={dxRef}
      rotated={meta.useRotate}
      width="100%"
      height="100%"
      pointSelectionMode={'multiple'}
      palette={getColor()}
      seriesSelectionMode={interactiveOption.mode}
    >
      <Legend
        visible={getDataField().dimensionGroup.length == 0 ?
          false : meta.legend.useLegend}
        position={meta.legend.position}
        horizontalAlignment={meta.legend.horizontalAlignment}
        verticalAlignment={meta.legend.verticalAlignment}
        itemTextPosition={meta.legend.itemTextPosition}
      />
      <CommonSeriesSettings
        type='rangebar'
        argumentField='args'
        rangeValue1Field='start'
        rangeValue2Field='end'
        barOverlapGroup='args'
        minBarSize={4}
      />
      <SeriesTemplate nameField="groups"/>
      <Tooltip
        customizeTooltip={(e) => {
          e.valueText = ('<b>' +
          e.argumentText.replaceAll('<br/>', ' ') + '</b><br/>' +
          (e.seriesName ? '<b>' + e.seriesName + '</b><br/>' : '') +
          e.valueText);
        }}
        format={'yyyy/MM/dd'}
        enabled={true}/>
    </Chart>
  );
};

export default React.memo(Timeline);
