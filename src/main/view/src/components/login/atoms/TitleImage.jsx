import {styled} from 'styled-components';
import loginTitleImg from '../../../assets/image/icon/login/logo_typeface.png';

const StyledLoginImg = styled.h1.attrs((props) => ({
}))`
  width: 205px;
  text-indent: -9999px;
  background: url(${loginTitleImg}) no-repeat 0 0;
  background-size: contain;
  margin: 0px;
`;
const TitleImage = ({type}) => {
  return (
    <StyledLoginImg src={type === 'login' ? loginTitleImg : loginTitleImg}>
      Logo
    </StyledLoginImg>
  );
};
export default TitleImage;
