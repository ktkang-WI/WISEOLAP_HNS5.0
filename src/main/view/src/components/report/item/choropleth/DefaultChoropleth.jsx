import {
  VectorMap
} from 'devextreme-react';
import {
  koreaDistrict,
  koreaProvince
} from './geoJson/GeoJsonKorea';
import {Layer, Size} from 'devextreme-react/vector-map';

const editOption = (isOk) => {
  if (!isOk) {
    return {
      wheelEnabled: false,
      panningEnabled: false,
      zoomingEnabled: false
    };
  }
};

const zoomSizeOption = (size) => {
  if (size === 'middle') {
    return {
      maxZoomFactor: 47,
      zoomFactor: 47
    };
  }
};

const geoJsonMapList = {
  'koreaProvince': koreaProvince,
  'koreaDistrict': koreaDistrict
};

export const findGeoJsonMap = (key) => {
  return geoJsonMapList[key];
};

const DefaultChoropleth = ({
  width = '100%',
  height = '100%',
  dataSource = null,
  selectedMapDataSource = null,
  editable = false,
  hoverEnabled=false,
  onClick,
  handleCustomize,
  ref
}) => {
  if (!dataSource) throw Error('dataSource can not be value of null');

  // Edit option
  const
    {
      wheelEnabled,
      panningEnabled,
      zoomingEnabled
    } = editOption(editable);

  // Zoom option
  const
    {
      maxZoomFactor,
      zoomFactor
    } = zoomSizeOption('middle');

  return (
    <VectorMap
      center={[127.59, 36.04]} // korea latitude and longitude
      maxZoomFactor={maxZoomFactor}
      zoomFactor={zoomFactor}
      wheelEnabled={wheelEnabled}
      panningEnabled={panningEnabled}
      zoomingEnabled={zoomingEnabled}
      onClick={onClick}
    >
      <Size
        width={width}
        height={height}
      />
      <Layer
        ref={ref}
        dataSource={dataSource}
        hoverEnabled={hoverEnabled}
        customize={handleCustomize}
      />
    </VectorMap>
  );
};

export default DefaultChoropleth;
