import Overlay from '../../Common/Wrap/Overlay';
import styled from 'styled-components';
import Wrapper from '../../Common/Wrap/Wrapper';
import loadingImg from 'assets/image/component/loading.gif';
import {selectJobQuantity} from 'redux/selector/LoadingSelector';
import {useSelector} from 'react-redux';

const ImgWrapper = styled(Wrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  z-index: 99999999999;
  background-image: url(${loadingImg});
  background-repeat: no-repeat;
  background-size: 64px 64px;
`;

const LoadingPanel = () => {
  const jobQuantity = useSelector(selectJobQuantity);

  if (jobQuantity == 0) return <></>;

  return (
    <Overlay zIndex={2000}>
      <ImgWrapper/>
    </Overlay>
  );
};

export default LoadingPanel;
