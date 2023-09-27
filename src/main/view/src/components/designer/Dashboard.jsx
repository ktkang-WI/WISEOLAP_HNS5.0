import {useEffect} from 'react';
import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {initReport} = ReportSlice.actions;

  useEffect(() => {
    dispatch(initReport());
  }, []);

  return (
    <>
      <Ribbon
        left={[
          'NewReport',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport'
        ]}
        middle={[
          'ConnectReport',
          'AddContainer'
        ]}
        right={[
          'AddChart',
          'AddPivotGrid',
          'AddGrid',
          'AddCustomChart'
        ]}
        customMenu={[
          'CaptionView',
          'NameEdit',
          'Rotate',
          'XAxisSetting',
          'YAxisSetting',
          'ExtraAxisSetting',
          'ShowColorLegend',
          'BarTwo',
          'Palette',
          'ColorEdit',
          'PointLabel'
        ]}
        querySearch={[
          'QuerySearch'
        ]}
      />
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Dashboard;
