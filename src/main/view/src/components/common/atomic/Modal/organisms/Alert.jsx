import Footer from '../molecules/Footer';
import Content from '../atoms/Content';
import {motion} from 'framer-motion';
import Wrapper from '../../Common/Wrap/Wrapper';
import Draggable from 'react-draggable';
import Overlay from '../../Common/Wrap/Overlay';
import {styled} from 'styled-components';
import warningImg from 'assets/image/component/warning.png';
import alertImg from 'assets/image/component/alert.png';

const AlertInnenr = styled.div`
  box-sizing: border-box;
  padding: 40px;
  padding-bottom: 20px;
  text-align: center;
  word-break: keep-all;

  img {
    display: block;
    margin: 20px auto 40px auto;
  }
`;

const Alert = ({
  children,
  onClose,
  onSubmit,
  width='320px', height='auto',
  type='alert',
  message='',
  ...props
}) => {
  return (
    <motion.div
      // NOTE: DevExpress Overlay 위로 알림창 띄울 경우
      // Alert가 Overlay 뒤에 그려지는 현상 때문에 zIndex 1800으로 지정
      // DevExpress 컴포넌트 사용하는 한 추후 디자인 변경시도 유지
      initial={{opacity: 0, zIndex: 1800}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      style={{position: 'fixed'}}
    >
      <Overlay>
        <Draggable
          handle='.modal-header'
        >
          <Wrapper>
            <motion.div
              style={{width: '100%', height: '100%'}}
              initial={{scale: 0.7}}
              animate={{scale: 1}}
              exit={{scale: 0.7}}
              transition={{duration: 0.2}}
            >
              <Content width={width} height={height}>
                <AlertInnenr>
                  <img src={type == 'warning' ? warningImg : alertImg}/>
                  {message}
                </AlertInnenr>
                <Footer
                  onSubmit={onSubmit}
                  onClose={onClose}
                />
              </Content>
            </motion.div>
          </Wrapper>
        </Draggable>
      </Overlay>
    </motion.div>
  );
};

export default Alert;
