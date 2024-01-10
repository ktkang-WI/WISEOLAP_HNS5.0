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
import useQueryExecute from 'hooks/useQueryExecute';
import React, {useRef, useEffect} from 'react';


const Chart = ({id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
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

  const interactiveOption = meta.interactiveOption;

  const {filterItems, clearAllFilter} = useQueryExecute();

  const dxRef = useRef();

  // local: 리렌더링할 때마다 초기화되는 변수
  let selectedData = [];

  // 마스터 필터 관련 useEffect
  useEffect(() => {
    dxRef.current.instance.clearSelection();
  }, [interactiveOption]);

  useEffect(() => {
    filterItems(item, {});
  }, [interactiveOption.targetDimension, interactiveOption.mode]);

  useEffect(() => {
    clearAllFilter(item);
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
          const name = dim[i].name;
          if (acc[name]) {
            acc[name].add(v);
          } else {
            acc[name] = new Set([v]);
          }
        });
      } else {
        filter.split('-').forEach((v, i) => {
          if (dimGrp.length <= i) return;
          const name = dimGrp[i].name;
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
      seriesSelectionMode={interactiveOption.mode}
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
