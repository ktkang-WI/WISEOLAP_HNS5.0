import {useEffect} from 'react';
import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import ReportType from './util/ReportType';
import ConfigSlice from 'redux/modules/ConfigSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {initReport} = ReportSlice.actions;
  const {setReportType} = ConfigSlice.actions;

  useEffect(() => {
    dispatch(initReport());
    dispatch(setReportType(ReportType.DASH_ANY));
  }, []);

  return (
    <>
      <Ribbon/>
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Dashboard;
