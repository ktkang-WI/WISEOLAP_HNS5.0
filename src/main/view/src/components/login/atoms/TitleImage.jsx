import {styled} from 'styled-components';
import loginTitleImg from '../../../assets/image/icon/login/logo_typeface.png';

const StyledLoginImg = styled.img.attrs((props) => ({
  src: props.src
}))`
  width: 200px;
  padding: 30px;
`;
const TitleImage = ({type}) => {
  return (
    <StyledLoginImg src={type === 'login' ? loginTitleImg : loginTitleImg}/>
  );
};
export default TitleImage;
