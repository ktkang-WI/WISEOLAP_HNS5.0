import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSpread from 'hooks/useSpread';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';


const SpreadBoard = () => {
  // hook
  const {setRibbonSetting} = spreadDefaultElement();
  const config = setRibbonSetting();
  const {createDesigner} = useSpread();
  const dispatch = useDispatch();

  const spreadActions = SpreadSlice.actions;

  useEffect(() => {
    createDesigner({
      config: config,
      reportId: 0
    });
    dispatch(spreadActions.setConfig(config));
  }, []);

  return (
    <Wrapper id='spreadWrapper'
      style={{width: '100%', height: 'calc(100% - 40px)'}}>
    </Wrapper>
  );
};

export default SpreadBoard;
