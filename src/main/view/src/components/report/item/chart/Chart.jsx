import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import DevChart, {
  ArgumentAxis,
  CommonSeriesSettings,
  CommonAxisSettings,
  Grid,
  Legend,
  Tooltip,
  Point,
  Series,
  ValueAxis
} from 'devextreme-react/chart';
import customizeTooltip from '../util/customizeTooltip';
import useQueryExecute from 'hooks/useQueryExecute';
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
import {generateLabelSuffix, formatNumber}
  from 'components/utils/NumberFormatUtility';
import _ from 'lodash';
import valueAxisCustomLabel from '../ValueAxisCustomLabel';
import React, {
  useRef,
  useEffect,
  useCallback,
  useState
} from 'react';
import {SubLinkReportPopup} from 'components/report/util/ReportUtility';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';
import {selectEditMode}
  from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
// import {EditMode} from 'components/config/configType';

const Chart = ({setItemExports, id, adHocOption, item}) => {
  const editMode = selectEditMode(store.getState());
  const dataFields = adHocOption ? adHocOption.dataField : item.meta.dataField;
  let seriesOptions = null;
  // TODO:  임시용 코드
  if (dataFields.seriesOptions) seriesOptions = dataFields.seriesOptions;
  const {
    auxiliaryAxis,
    ignoreEmptyPoints,
    pointerMarker,
    reverseView} = getSeriesGeneralOption(seriesOptions);
  const overlapping = overlappingFormat(seriesOptions);

  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  const seriesNames = mart.data.info.seriesMeasureNames;

  const interactiveOption = adHocOption ?
  {} : meta.interactiveOption;

  const {filterItems, clearAllFilter} = useQueryExecute();

  const dxRef = useRef([]);

  const itemExportObject =
   itemExportsObject(id, dxRef, 'CHART', mart.data.data);

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

  // local: 리렌더링할 때마다 초기화되는 변수
  let selectedData = [];

  const [showPopup, setShowPopup] = useState(false);
  const focusedItem = useSelector(selectCurrentDataField);

  const handleContextMenu = useCallback((event) => {
    // if (editMode === EditMode.DESIGNER) {
    event.preventDefault();
    setShowPopup(true);
    // }
  }, [editMode]);

  useEffect(() => {
    // if (editMode === EditMode.DESIGNER) {
    const chartContainer = dxRef.current.instance._renderer.root.element;
    if (chartContainer) {
      chartContainer.addEventListener('contextmenu', handleContextMenu);
      return () =>
        chartContainer.removeEventListener('contextmenu', handleContextMenu);
    }
    // }
  }, [handleContextMenu, editMode]);

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
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled]);

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
        selectedData = [];
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
      if (interactiveOption.mode == 'single') {
        selectedData = [];
        if (target.series.isSelected()) {
          component.clearSelection();
          filterItems(item, {});
          return;
        }
        component.clearSelection();
      }
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


  const customizeLabel = (o, formats) => {
    const formData = formats[o.series.tag.math];
    if (!formData) console.error('format 데이터쪽 확인필요이상감지');
    const labelSuffix = generateLabelSuffix(formData);
    o.value = formatNumber(o.value, formData, labelSuffix);
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
    <>
      <DevChart
        dataSource={mart.data.data}
        width="100%"
        height="100%"
        customizeLabel={(o) => customizeLabel(o, mart.formats)}
        resolveLabelOverlapping={overlapping}
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
          <Point visible={pointerMarker} />
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
          name="left"
          position="left"
          title={meta.yAxis.customText} // 사용자정의텍스트
          showZero={meta.yAxis.axisStartToZero} // 제로수준 표시
          label={{
            visible: meta.yAxis.useAxis, // y축 표시
            customizeText: ({value}) => { // y축 custom Suffix
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
            title={meta.extraAxis.customText} // 사용자정의텍스트
            showZero={meta.extraAxis.axisStartToZero} // 제로수준 표시
            label={{
              visible: meta.extraAxis.useAxis, // y축 표시
              customizeText: ({value}) => { // y축 custom Suffix
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
                  axis={getAuxiliaryAxis(valueField.fieldId, seriesOptions)}
                  key={valueField.summaryName+'-'+i}
                  valueField={valueField.summaryName}
                  argumentField='arg'
                  tag={{
                    fieldId: valueField.fieldId,
                    math: Math.floor(i / mart.seriesLength)
                  }}
                  name={valueField.caption || '\u2800'}
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
      {showPopup && (
        <SubLinkReportPopup
          showButton={showPopup}
          setShowButton={setShowPopup}
          focusedItem={focusedItem}
          editMode={editMode}
        />
      )}
    </>
  );
};


const getDataField = (state) => {
  if (state.adHocOption) {
    return state.adHocOption.dataField;
  };
  return state.item.meta.dataField;
};

const propsComparator = (prev, next) => {
  const prevDataField = getDataField(prev);
  const nextDataField = getDataField(next);

  if (_.isEqual(prev.item.mart.data, next.item.mart.data)) {
    if (!_.isEqual(prevDataField.datasetId, nextDataField.datasetId)) {
      return true;
    }
  };

  const seriesOptionsComparator =
    _.isEqual(prevDataField.seriesOptions, nextDataField.seriesOptions);
  const rotateComparator =
    _.isEqual(prev.item.meta.useRotate, next.item.meta.useRotate);
  return prev.item.mart == next.item.mart &&
  _.isEqual(prev.item.meta.interactiveOption,
      next.item.meta.interactiveOption) &&
      seriesOptionsComparator &&
      rotateComparator &&
  _.isEqual(prev.adHocOption, next.adHocOption);
};


export default React.memo(Chart, propsComparator);
