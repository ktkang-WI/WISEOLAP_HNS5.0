import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import SpreadContent from './SpreadContent';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useEffect} from 'react';
import DatasetSlice from 'redux/modules/DatasetSlice';

// ribbon height = 147px
const Spreadsheet = () => {
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  const {initDatasets} = DatasetSlice.actions;

  useEffect(() => {
    dispatch(initDatasets());
    dispatch(setDesignerMode('Excel'));
  });

  return (
    <>
      <Ribbon/>
      <SpreadContent />
    </>
  );
};

export default Spreadsheet;
