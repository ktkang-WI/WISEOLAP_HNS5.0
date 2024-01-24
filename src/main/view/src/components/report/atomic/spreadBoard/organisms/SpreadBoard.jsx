import './spreadBoard.css';
import spreadDefaultElement from './SpreadDefaultElement';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {selectCurrentDesigner} from 'redux/selector/SpreadSelector';
import store from 'redux/modules';
import {useEffect} from 'react';

const SpreadBoard = () => {
  const {createDesigner} = spreadDefaultElement();

  useEffect(() => {
    const designer = selectCurrentDesigner(store.getState());
    if (_.isEmpty(designer)) {
      createDesigner({reportId: 0});
    }
  });

  return (
    <Wrapper id='spreadWrapper'
      style={{width: '100%', height: 'calc(100% - 40px)'}}>
    </Wrapper>
  );
};

export default SpreadBoard;
