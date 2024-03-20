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
`;

const LoadingPanel = () => {
  const jobQuantity = useSelector(selectJobQuantity);

  if (jobQuantity == 0) return <></>;

  return (
    <Overlay zindex={2000}>
      <ImgWrapper>
        <img src={loadingImg} width='64px' height='64px'/>
      </ImgWrapper>
    </Overlay>
  );
};

export default LoadingPanel;
