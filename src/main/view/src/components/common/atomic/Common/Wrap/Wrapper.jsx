import {styled} from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: ${(props)=> props.display ? props.display : 'block'};
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
  flex: 0 0 ${(props)=>props.size ? props.size : 1};
`;

export default Wrapper;
