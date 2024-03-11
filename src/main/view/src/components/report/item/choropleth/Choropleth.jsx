import {
  VectorMap
} from 'devextreme-react';
import {Label, Layer, Tooltip} from 'devextreme-react/vector-map';


const Choropleth = ({
  setItemExports, id, item
}) => {
  const mart = item ? item.mart : null;

  if (!mart.init) {
    return <></>;
  }
  const options = item ? item.options : null;
  const dataSource = mart.data.data;
  const [key] = options.key;
  const seriesNames = mart.data.info.seriesMeasureNames;
  const colorGroups = [0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000];

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

  return (
    <VectorMap
      center={[127.59, 35.94]} // korea latitude and longitude
      maxZoomFactor={1300}
      minZoomFactor={45}
      zoomFactor={50}
      width='100%'
      height='100%'
    >
      <Layer
        dataSource={options.geoJson[0]}
        palette="Violet"
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
