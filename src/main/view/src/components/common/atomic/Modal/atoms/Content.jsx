import {styled, css} from 'styled-components';

const Content = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  position: absolute;
  ${(props) => props.height == 'auto' ?
    'top: calc(50% - 200px);' :
    css`top: calc(50% - (${(props) => props.height} / 2));`}
  
  left: calc(50% - (${(props) => props.width} / 2));
  border-radius: 16px;
  background-color: white;
  justify-content: center;
  overflow: auto;
  box-sizing: border-box;
  padding: 0px;
`;

export default Content;
