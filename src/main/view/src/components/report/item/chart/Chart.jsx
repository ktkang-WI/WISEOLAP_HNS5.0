import DevChart, {
  Legend,
  Tooltip,
  Series,
  Label,
  ValueAxis,
  Title
} from 'devextreme-react/chart';
import customizeTooltip from '../util/customizeTooltip';
import useQueryExecute from 'hooks/useQueryExecute';
import React, {useRef, useEffect} from 'react';
import NumberFormatUtility from 'components/utils/NumberFormatUtility';
import _ from 'lodash';

const Chart = ({id, adHocOption, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  const seriesNames = mart.data.info.seriesDimensionNames;
  const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  const interactiveOption = adHocOption ?
  {} : meta.interactiveOption;

  const {filterItems, clearAllFilter} = useQueryExecute();

  const dxRef = useRef();

  // local: 리렌더링할 때마다 초기화되는 변수
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

  return (
    <DevChart
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      id={id}
      ref={dxRef}
      onPointClick={onPointClick}
      pointSelectionMode={'multiple'}
      rotated={meta.useRotate}
      seriesSelectionMode={interactiveOption.mode}
    >
      {meta.yAxis.useAxis && <ValueAxis
        position='left'
      >
        <Label
          customizeText={(e) =>
            NumberFormatUtility.formatNumber(
                e.value,
                meta.yAxis.formatType,
                meta.yAxis.unit,
                meta.yAxis.precision,
                meta.yAxis.useDigitSeparator,
                undefined,
                meta.yAxis.suffix,
                meta.yAxis.suffixEnabled,
                meta.yAxis.precisionType
            )
          }
        />
        <Title
          text={meta.yAxis.customText}
        />
      </ValueAxis>}
      {meta.supplyAxis.useAxis && <ValueAxis
        position='right'
      >
        <Label
          customizeText={(e) =>
            NumberFormatUtility.formatNumber(
                e.value,
                meta.supplyAxis.formatType,
                meta.supplyAxis.unit,
                meta.supplyAxis.precision,
                meta.supplyAxis.useDigitSeparator,
                undefined,
                meta.supplyAxis.suffix,
                meta.supplyAxis.suffixEnabled,
                meta.supplyAxis.precisionType
            )}
        />
        <Title
          text={meta.supplyAxis.customText}
        />
      </ValueAxis>}
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
                key={valueField}
                tag={Math.floor(i / mart.seriesLength)}
                valueField={valueField}
                argumentField='arg'
                name={seriesCaptions[i]}
                type={meta.seriesType ? meta.seriesType : 'bar'}
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
  _.isEqual(prev.item.meta.useRotate,
      next.item.meta.useRotate) &&
  _.isEqual(prev.item.meta.seriesType,
      next.item.meta.seriesType) &&
  _.isEqual(prev.adHocOption, next.adHocOption);
};

export default React.memo(Chart, propsComparator);
