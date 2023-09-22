import {styled} from 'styled-components';

const SmallButtonImage = styled.img`
  height: ${(props) => props.height || '24px'};
  width: auto;
`;

export default SmallButtonImage;
