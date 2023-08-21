import SmallButtonImage from '../atoms/SmallButtonImage';
import SmallButtonLabel from '../atoms/SmallButtonLabel';
import {styled} from 'styled-components';

const Wrapper = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
`;

const LabelImageButton = ({label, imgSrc, height='60px', width='60px'}) => {
  return (
    <Wrapper height={height} width={width} title={label}>
      <SmallButtonImage src={imgSrc}/>
      <SmallButtonLabel>{label}</SmallButtonLabel>
    </Wrapper>
  );
};

export default LabelImageButton;
