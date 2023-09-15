import {styled} from 'styled-components';
import LoginLogo from '../assets/image/icon/login/login_visual.png';
import PagingTransition from
  'components/common/routesTransition/PagingTransition';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrap = styled.div``;

const Container = styled.div`
  top: 50%;
  transform: translateY(-50%);
  border-radius: 10px;
  border: 2px solid #eaf0f6;
  position: absolute;
  width: 1122px;
  min-height: 682px;
  overflow: hidden;
  display: block;
  left: 50%;
  margin-left: -561px;
`;

const InnerWrap = styled.div`
  min-height: inherit;

  & > .page-enter {
    z-index: 0;
    transform: translateX(0);
  }

  & > .page-enter-active {
    transform: translateX(0);
    transition: transform 300ms ease-in-out;
  }

  & > .page-exit {
    transform: translateX(100%);
  }

  & > .page-exit-active {
    z-index: 1;
    transform: translateX(0);
    transition: transform 200ms ease-in-out;
  }
`;

const StyledLoginImg = styled.img`
  width: 400px;
  margin-left: -20px;
  vertical-align: middle;
  max-width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
`;

const LoginLogoWrap = styled.div`
  width: 50%;
  height: 100%;
  float: left;
  border-right: 1px solid #e7e7e7;;
`;

const VisualInnerWrap = styled.div`
  display: flex;
  height: 682px;
  align-items: center;
  justify-content: center;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font:${theme.font.small}
`;

const Login = () => {
  return (
    <div>
      <Wrap>
        <Container className="containerWrap" id="container">
          <InnerWrap className='innerWrap'>
            <LoginLogoWrap className='loginLogoWrap'>
              <VisualInnerWrap className='visualInnerWrap'>
                <StyledLoginImg src={LoginLogo}/>
              </VisualInnerWrap>
            </LoginLogoWrap>
            <PagingTransition/>
          </InnerWrap>
        </Container>
        <Footer>2019 © Intelligence by wise</Footer>
      </Wrap>
    </div>
  );
};
export default Login;
