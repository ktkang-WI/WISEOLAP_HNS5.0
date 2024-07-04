import {styled} from 'styled-components';
import LoginLogo from '../assets/image/logo/login_image.png';
import bgLogo from '../assets/image/logo/logo_wi_bg.png';
import wordLogo from '../assets/image/logo/logo_wiseitech.png';
import PagingTransition from
  'components/common/atomic/Common/Interactive/PagingTransition';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrap = styled.div`
  width: 100%;
  height: 100%;
`;

const BackgroundLogo = styled.img`
  width: 40vw;
  height: auto;
  position: absolute;
  right: 0;
  bottom: 0;
`;

const WordLogo = styled.img`
  height: auto;
  width: 182px;
  position: absolute;
  left: 140px;
  top: 80px;
`;

const Container = styled.div`
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid #eaf0f6;
  border-radius: 32px 82px;
  background: white;
  position: absolute;
  width: 1000px;
  height: 538px;
  overflow: hidden;
  display: block;
  left: 50%;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
`;

const InnerWrap = styled.div`
  min-height: inherit;

  & > div {
    width: 50%;
    float: left;
    box-sizing: border-box;
    padding: 50px 70px;
  }

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
  vertical-align: middle;
  max-width: 100%;
  height: auto;
  -webkit-backface-visibility: hidden;
`;

const LoginLogoWrap = styled.div`
  width: 50%;
  height: 100%;
`;

const VisualInnerWrap = styled.div`
  display: flex;
  height: 420px;
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
    <Wrap>
      <BackgroundLogo src={bgLogo}/>
      <WordLogo src={wordLogo}/>
      <Container className="containerWrap" id="container">
        <InnerWrap className='innerWrap'>
          <PagingTransition/>
          <LoginLogoWrap className='loginLogoWrap'>
            <VisualInnerWrap className='visualInnerWrap'>
              <StyledLoginImg src={LoginLogo}/>
            </VisualInnerWrap>
          </LoginLogoWrap>
        </InnerWrap>
      </Container>
      <Footer>2019 © Intelligence by wise</Footer>
    </Wrap>
  );
};
export default Login;
