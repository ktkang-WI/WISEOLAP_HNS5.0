import './spreadBoard.css';
// import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSpread from 'hooks/useSpread';
import {useEffect} from 'react';


const SpreadBoard = () => {
  // action
  // const {setRibbonSetting} = spreadDefaultElement();
  // const config = setRibbonSetting();
  const {createDesigner} = useSpread();

  useEffect(() => {
    createDesigner({
      config: {},
      newReportId: 0,
      spread: {}
    });
  }, []);

  return (
    <Wrapper id='spreadWrapper'
      style={{width: '100%', height: 'calc(100% - 40px)'}}>
    </Wrapper>
  );
};

export default SpreadBoard;
