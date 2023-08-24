import SmallButtonImage from '../atoms/SmallButtonImage';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  height: ${(props) => props.height};
  text-align: center;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  background-image: ${theme.color.queryBackgroundImage};
  border-radius: 50%;
`;

const OnlyImageButton = ({label, imgSrc, height='60px', width='60px'}) => {
  return (
    <Wrapper height={height} width={width} title={label}>
      <SmallButtonImage src={imgSrc}/>
    </Wrapper>
  );
};

export default OnlyImageButton;
