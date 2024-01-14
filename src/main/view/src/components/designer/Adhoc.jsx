import ConfigSlice from 'redux/modules/ConfigSlice';
import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import {DesignerMode} from 'components/config/configType';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

const Adhoc = () => {
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  useEffect(() => {
    dispatch(setDesignerMode(DesignerMode['ADHOC']));
  });
  return (
    <>
      <Ribbon/>
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Adhoc;
