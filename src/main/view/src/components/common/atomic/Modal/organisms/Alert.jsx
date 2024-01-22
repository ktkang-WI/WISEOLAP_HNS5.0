import Footer from '../molecules/Footer';
import Content from '../atoms/Content';
import Inner from '../atoms/Inner';
import {motion} from 'framer-motion';
import Wrapper from '../../Common/Wrap/Wrapper';
import Header from '../molecules/Header';
import localizedString from 'config/localization';
import Draggable from 'react-draggable';
import Overlay from '../../Common/Wrap/Overlay';

const Alert = ({
  children,
  onClose,
  onSubmit,
  width='350px', height='170px',
  type='alert',
  message='',
  ...props
}) => {
  return (
    <motion.div
      initial={{opacity: 0, zIndex: 1600}}
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
                <Header>
                  {type == 'alert'? localizedString.alert :
                    type == 'warning' ? localizedString.warning :
                    type == 'confirm' ? localizedString.confirm : ''}
                </Header>
                <Inner>
                  {message}
                </Inner>
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
