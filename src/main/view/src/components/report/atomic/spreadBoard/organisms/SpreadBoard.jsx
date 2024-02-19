import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useSpread from 'hooks/useSpread';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
  margin-bottom: 0px;
  border: 1px solid ${theme.color.gray200};
  border-radius: 10px;
  overflow: hidden;
  text-align: left;

  .name-box-selector {
    height: 21px;
  }

  .gc-ribbon-bar .ribbon-navigation .ribbon-navigation-item {
    border-radius: 8px 8px 0px 0px;
  }
`;

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
    <StyledWrapper className='section board'>
      <Wrapper id="spreadWrapper"/>
    </StyledWrapper>
  );
};

export default SpreadBoard;
