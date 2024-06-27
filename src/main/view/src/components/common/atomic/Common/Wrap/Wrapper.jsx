import {styled} from 'styled-components';

const Wrapper = styled.div`
  max-width: ${(props) => props.maxWidth ? props.maxWidth : '100%'};
  width: ${(props) => props.width ? props.width : '100%'};
  height: ${(props) => props.height ? props.height : '100%'};
  display: ${(props) => props.display ? props.display : 'block'};
  flex-direction: ${(props) => props.direction ? props.direction : 'row'};
  flex: ${(props) => props.size ? props.size : '0 0 1'};
  justify-content: ${(props) => props.center ? props.center : 'start'};
  align-items: ${(props) => props.center ? props.center : 'start'};
  padding: ${(props) => props.padding ? props.padding : '0px'};
  ${(props) => props.margin ? 'margin: ' + props.margin + ';' : ''};
  overflow: ${(props) => props.overflow ? props.overflow : 'visible'};
`;

export default Wrapper;
