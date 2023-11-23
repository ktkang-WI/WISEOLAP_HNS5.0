import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReport}
  from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import {getItemData} from 'models/report/Item';

const useReportSave = () => {
  // const dispatch = useDispatch();

  /**
   * 저장에 필요한 파라미터 생성
   * @param {JSON} dataSource 저장에 필요한 instance 배열
   * @return {JSON} parameter
   */
  const generateParameter = (dataSource) => {
    const param = {...dataSource};
    // param.fldId = 1901;
    // param.fldType = 'PUBLIC';

    param.reportType = 'DashAny';

    param.reportXML = selectCurrentReport(store.getState());
    param.chartXML = selectCurrentItem(store.getState());
    param.layoutXML = {};
    param.datasetXML = selectCurrentDataset(store.getState());
    param.paramXML = {};

    param.regUserNo = '1001';
    param.regDt = '2023-11-08:04:41:46';

    return param;
  };

  /**
   * 보고서 저장
  *  @param {JSON} report 저장할 보고서
   * @param {JSON} dataSource 저장에 필요한 Modal dataSource
   */
  const saveReport = (report, dataSource) => {
    // const tempReport = _.cloneDeep(report);
    const param = generateParameter(dataSource);

    getItemData(param, (response) => {
      if (response.status != 200) {
        return;
      }
      // dispatch(inserReport({tempReport}));
      console.log(response);
    });
  };

  return {
    saveReport
  };
};

export default useReportSave;
