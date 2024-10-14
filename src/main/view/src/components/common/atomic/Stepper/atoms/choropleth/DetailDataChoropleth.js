import {useContext} from 'react';
import {Container}
  from '../../molecules/choropleth/MappingDataChoropleth';
import {DataGrid} from 'devextreme-react';
import {Column, FilterRow, Selection} from 'devextreme-react/data-grid';
import {ChoroplethContext}
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';

const DetailDataChoropleth = () => {
  const getContext = useContext(ChoroplethContext);
  const [geoJson, setGeoJson] = getContext.state.geoJson;
  const [key] = getContext.state.key;
  const [, setSingleDataOfKey] =
    getContext.state.singleDataOfKey;
  const dataOfKey = geoJson.features.map((item) => {
    return {
      ...item.properties
    };
  });

  const handleCellClick = (e) => {
    setSingleDataOfKey(e.data);
    setGeoJson((prev) => {
      return {
        ...prev
      };
    });
  };
  return (
    <Container>
      <DataGrid
        dataSource={dataOfKey}
        onCellClick={handleCellClick}
        allowColumnResizing={true}
      >
        <Selection mode="single" />
        <FilterRow visible={true} />
        <Column
          dataField={key}
        />
      </DataGrid>
    </Container>
  );
};

export default DetailDataChoropleth;
