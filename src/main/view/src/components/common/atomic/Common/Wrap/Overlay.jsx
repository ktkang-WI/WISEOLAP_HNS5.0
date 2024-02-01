import {styled} from 'styled-components';

const Overlay = styled.div`
  background-color: rgba(255, 255, 255, 0.4);
  width: 100%;
  height: 100vh;
  z-index: ${(props) => props.zIndex || 50};
  position: fixed;
  top: 0;
  left: 0;
`;

export default Overlay;
