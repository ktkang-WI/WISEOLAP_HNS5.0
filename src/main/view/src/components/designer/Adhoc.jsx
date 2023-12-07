import {useEffect} from 'react';
import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';

const Adhoc = () => {
  const dispatch = useDispatch();
  const {initReport} = ReportSlice.actions;

  useEffect(() => {
    dispatch(initReport());
  }, []);


  return (
    <>
      <Ribbon/>
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Adhoc;
