import styled from 'styled-components';
import MappingKeyChoropleth from '../../atoms/choropleth/KeyMappingChoropleth';
import PreviewChoropleth from '../../atoms/choropleth/PreviewChoropleth';
import DetailDataChoropleth from '../../atoms/choropleth/DetailDataChoropleth';

export const Container = styled.div`
  margin: ${(props) => props.margin ? props.margin : ''};
  padding: ${(props) => props.padding ? props.padding : ''};
  width: ${(props) => props.width ? props.width : '100%'};
  height: ${(props) => props.height ? props.height : '100%'};
  box-sizing: border-box;
  display: ${(props) => props.display ? props.display : 'flex'};
  flex-direction:
    ${(props) => props.flexDirection ? props.flexDirection : 'row'};
  flex: 0 0 ${(props) => props.flexWidth ? props.flexWidth : 1};
  background-color:
    ${(props) => props.backgroundColor ? props.backgroundColor : 'white'};
  border: ${(props) => props.border ? props.border : ''};
`;

const MappingDataChoropleth = () => {
  return (
    <Container
      width="100%"
      height="420px"
      display="flex"
    >
      <Container
        padding="10px">
        <MappingKeyChoropleth />
      </Container>
      <Container
        padding="10px">
        <PreviewChoropleth />
      </Container>
      <Container
        padding="10px">
        <DetailDataChoropleth />
      </Container>
    </Container>
  );
};

export default MappingDataChoropleth;
