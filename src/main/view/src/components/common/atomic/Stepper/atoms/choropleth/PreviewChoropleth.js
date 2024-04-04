import {useContext} from 'react';
import {Container}
  from '../../molecules/choropleth/MappingDataChoropleth';
import DefaultChoropleth
  from 'components/report/item/choropleth/DefaultChoropleth';
import {ChoroplethContext}
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';

const PreviewChoropleth = () => {
  const getContext = useContext(ChoroplethContext);
  const [geoJson] = getContext.state.geoJson;
  const [key] = getContext.state.key;
  const [singleDataOfKey] = getContext.state.singleDataOfKey;
  const handleCustomize = (e) => {
    e.forEach((item) => {
      if (!singleDataOfKey) return;
      if (item.attribute(key) === singleDataOfKey[key]) {
        item.applySettings({color: '#378CE7'});
      }
    });
  };

  return (
    <Container
      display='flex'
      flexDirection='column'
    >
      <DefaultChoropleth
        dataSource={geoJson}
        handleCustomize={handleCustomize}
      >
      </DefaultChoropleth>
    </Container>
  );
};

export default PreviewChoropleth;
