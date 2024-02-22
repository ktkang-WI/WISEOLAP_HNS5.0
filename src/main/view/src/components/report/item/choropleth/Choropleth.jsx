import {Label, Layer} from 'devextreme-react/vector-map';
import React from 'react';
import mapsData from './geoJson/TL_SCCO_CTPRVN.json';
import {Map} from 'devextreme-react';

const Choropleth = () => {
  return (
    <Map>
      <Layer
        name="areas"
        dataSource={mapsData.features.geometry.coordinates}
        colorGroupingField="total"
      >
        <Label
          dataField="name"
          enabled={true}
        />
      </Layer>
    </Map>
  );
};

export default React.memo(Choropleth);
