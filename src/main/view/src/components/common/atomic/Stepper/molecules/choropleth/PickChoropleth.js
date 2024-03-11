import {useContext} from 'react';
import styled from 'styled-components';
import {DataGrid} from 'devextreme-react';
import {Column, FilterRow, Selection} from 'devextreme-react/data-grid';
import
{findGeoJsonMap} from 'components/report/item/choropleth/DefaultChoropleth';
import {Container} from './MappingDataChoropleth';
import {ChoroplethContext}
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';
import DefaultChoropleth
  from 'components/report/item/choropleth/DefaultChoropleth';

const StyledPickMap = styled.div`
  flex: 0 0 1;
`;

const StyledShowMap = styled.div`
  flex: 0 0 1;
`;

const PickMap = ({children}) => {
  return (
    <StyledPickMap>
      {children}
    </StyledPickMap>
  );
};

const ShowMap = ({children}) => {
  return (
    <StyledShowMap>
      {children}
    </StyledShowMap>
  );
};

const dataSource = {
  'value': [
    {
      'key': 'koreaProvince',
      'name': '대한민국 > 시도'
    },
    {
      'key': 'koreaDistrict',
      'name': '대한민국 > 군'
    }

  ]
};

const PickChoropleth = () => {
  const getContext = useContext(ChoroplethContext);
  const [geoJsonMap, setGeoJsonMap] = getContext.state.geoJson;

  const handleCellClick = (e) => {
    const key = e?.data?.key;
    if (!key) return;
    const geoJson = findGeoJsonMap(key);
    setGeoJsonMap(geoJson);
  };

  return (
    <Container
      height="420px"
    >
      <PickMap>
        <DataGrid
          width="100%"
          height="100%"
          dataSource={dataSource.value}
          showRowLines={true}
          showBorders={true}
          columnAutoWidth={true}
          onCellClick={handleCellClick}
        >
          <Selection mode="single" />
          <FilterRow visible={true} />
          <Column
            keyExpr="name"
            caption="지도 목록"
            dataField="name"/>
        </DataGrid>
      </PickMap>
      <ShowMap>
        <DefaultChoropleth
          width={600}
          height={420}
          dataSource={geoJsonMap}
        />
      </ShowMap>
    </Container>
  );
};

export default PickChoropleth;
