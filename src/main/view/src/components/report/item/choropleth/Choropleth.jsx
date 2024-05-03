import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {
  VectorMap
} from 'devextreme-react';
import {
  Label,
  Layer,
  Legend,
  Source,
  Tooltip
} from 'devextreme-react/vector-map';
import React, {useEffect, useRef} from 'react';
import {useInteractiveEffect} from '../util/useInteractiveEffect';

const generateColorGroups = (colorGroupIndex) => {
  return [...Array(7)].map((_, i) => i * colorGroupIndex);
};

const Choropleth = ({
  setItemExports, id, item
}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  // 마스터 필터 START
  const {
    masterFilterOption,
    functions
  } = useInteractiveEffect({
    item: item,
    meta: meta,
    selectionFunc: (event) => {
      event?.forEach((e) => e?.target?.selected(true));
    }
  });

  // 마스터 필터 END

  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'CHOROPLETH', mart.data.data);
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

  const options = item ? item.options : null;
  const dataSource = mart.data.data;
  const [key] = options.key;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const colorGroupIndex = Math.max.apply(
      null,
      mart.data.data.map((item) => item[seriesNames[0].summaryName])) / 6;
  const colorGroups = generateColorGroups(colorGroupIndex);
  const handleCustomize = (e) => {
    const matchingKey = seriesNames[0].summaryName;
    e.forEach((element, index) => {
      const object = element.attribute(key);
      const measure = dataSource.filter((item) => item['arg'] === object)[0];
      if (!measure) return;
      element.attribute('measure', measure ? measure[matchingKey] : 0);
    });
  };

  const customizeTooltip = (arg) => {
    if (arg.attribute(key)) {
      const matchingKey = seriesNames[0].summaryName;
      const selectedObject =
        dataSource.filter((item) => item['arg'] === arg.attribute(key))[0];
      return {text: `${selectedObject['arg']}: ${selectedObject[matchingKey]}`};
    }
    return null;
  };
  const customizeText = (arg) => {
    return `${arg.start} ~ ${arg.end}`;
  };

  const handleClickEventSwitching = (e) => {
    const identifier = e?.target?.layer?.type;
    if (!identifier) return;
    switch (identifier) {
      case 'area': {
        handleLayerClick(e);
        break;
      }
      default: {
        return;
      }
    }
  };
  const handleLayerClick = (e) => {
    // 마스터 필터 데이터 설정.
    e.data = e?.target.attribute(key);
    functions.setDataMasterFilter(e.data);
    functions.masterFilterReload(e);
  };
  const handleClick = (e) => {
    handleClickEventSwitching(e);
  };
  return (
    <VectorMap
      ref={dxRef}
      center={[127.59, 35.94]} // korea latitude and longitude
      maxZoomFactor={1300}
      minZoomFactor={45}
      zoomFactor={50}
      width='100%'
      height='100%'
      wheelEnabled={false}
      panningEnabled={false}
      zoomingEnabled={false}
      onClick={handleClick}
    >
      <Legend
        horizontalAlignment='right'
        verticalAlignment='top'
        customizeText={customizeText}
        visible={meta.choroplethOption.legend}
      >
        <Source layer='vector-map' grouping='color'></Source>
      </Legend>
      <Layer
        name='vector-map'
        dataSource={options.geoJson[0]}
        palette={meta?.palette?.colors ? meta?.palette?.colors : 'Material'}
        colorGroupingField="measure"
        colorGroups={colorGroups}
        customize={handleCustomize}
        selectionMode={masterFilterOption.interactiveOption.mode}
      >
        <Label enabled={true} dataField={key}></Label>
      </Layer>
      <Tooltip enabled={true} customizeTooltip={customizeTooltip}></Tooltip>
    </VectorMap>
  );
};

const propsComparator = (prev, next) => {
  let result = true;
  if (!_.isEqual(prev?.item?.mart, next?.item?.mart)) {
    result = false;
  }
  if (!_.isEqual(prev?.item?.meta, next?.item?.meta)) {
    result = false;
  }
  return result;
};

export default React.memo(Choropleth, propsComparator);
