import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import {DesignerMode} from 'components/config/configType';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  useEffect(() => {
    dispatch(setDesignerMode(DesignerMode['DASHBOARD']));
  });
  return (
    <>
      <Ribbon/>
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Dashboard;
