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

  return (
    <VectorMap
      center={[127.59, 35.94]} // korea latitude and longitude
      maxZoomFactor={1300}
      minZoomFactor={45}
      zoomFactor={50}
      width='100%'
      height='100%'
      wheelEnabled={false}
      panningEnabled={false}
      zoomingEnabled={false}
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
        palette={meta?.palette?.name ? meta?.palette?.name : 'Violet'}
        colorGroupingField="measure"
        colorGroups={colorGroups}
        customize={handleCustomize}
      >
        <Label enabled={true} dataField={key}></Label>
      </Layer>
      <Tooltip enabled={true} customizeTooltip={customizeTooltip}></Tooltip>
    </VectorMap>
  );
};

export default Choropleth;
