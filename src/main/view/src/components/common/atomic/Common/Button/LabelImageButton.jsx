import SmallButtonImage from '../Image/SmallButtonImage';
import SmallButtonLabel from '../Label/SmallButtonLabel';
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

const LabelImageButton = (
    {label, imgSrc, height='60px', width='60px', ...props}) => {
  return (
    <Wrapper height={height} width={width} title={label}
      onClick={props.onClick}
    >
      <SmallButtonImage src={imgSrc}/>
      <SmallButtonLabel>{label}</SmallButtonLabel>
    </Wrapper>
  );
};

export default LabelImageButton;
