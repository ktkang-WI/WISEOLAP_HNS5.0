import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import SpreadContent from './SpreadContent';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useEffect} from 'react';
import ReportType from './util/ReportType';
import DatasetSlice from 'redux/modules/DatasetSlice';

// ribbon height = 147px
const Spreadsheet = () => {
  const dispatch = useDispatch();
  const {setReportType} = ConfigSlice.actions;
  const {initDatasets} = DatasetSlice.actions;

  useEffect(() => {
    dispatch(initDatasets());
    dispatch(setReportType(ReportType.EXCEL));
  }, []);
  return (
    <>
      <Ribbon/>
      <SpreadContent />
    </>
  );
};

export default Spreadsheet;
