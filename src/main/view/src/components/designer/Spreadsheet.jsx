import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';
import SpreadContent from './SpreadContent';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useEffect} from 'react';
import ReportType from './util/ReportType';

// ribbon height = 147px
const Spreadsheet = () => {
  const dispatch = useDispatch();
  const {setReportType} = ConfigSlice.actions;

  useEffect(() => {
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
