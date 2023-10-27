import ChartUtility from 'components/report/item/chart/Utility';
import ItemType from 'components/report/item/util/ItemType';
import {getItemData} from 'models/report/Item';
import {
  selectCurrentDatasets
} from 'redux/selector/DatasetSelector';
import {
  selectCurrentItems
} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import _ from 'lodash';
import {useDispatch} from 'react-redux';


const useQueryExecute = () => {
  const {updateItem} = ItemSlice.actions;
  const dispatch = useDispatch();

  /**
   * 조회에 필요한 파라미터 생성
   * @param {JSON} item 조회할 아이템
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   * @return {JSON} parameter
   */
  const generateParameter = (item, datasets) => {
    const param = {};

    // TODO: 로그인 추가 후 유저 아이디 수정
    param.userId = 'admin';
    param.itemType = item.type;
    param.dataset = {};

    const orgDataset = datasets.find(
        (dataset) => item.meta.dataField.datasetId == dataset.datasetId
    );

    param.dataset.dsId = orgDataset.dataSrcId;
    param.dataset.dsType = orgDataset.datasetType;
    param.dataset.query = orgDataset.datasetQuery;

    param.dataset = JSON.stringify(param.dataset);

    if (item.type == ItemType.CHART) {
      ChartUtility.generateParameter(item, param);
    }

    return param;
  };

  /**
   * 매개변수로 전달받은 item만 조회
   * @param {JSON} item 조회할 아이템
   * @param {JSON} datasets 조회할 아이템이 속한 보고서의 datasets
   */
  const executeItem = (item, datasets) => {
    const param = generateParameter(item, datasets);
    const reportId = selectCurrentReportId(store.getState());
    getItemData(param, (response) => {
      if (response.status != 200) {
        return;
      }

      item.mart.init = true;
      item.mart.data = response.data;

      if (item.type == ItemType.CHART) {
        ChartUtility.generateItem(item, response.data);
      }

      dispatch(updateItem({reportId, item}));
    });
  };

  /**
   * 선택돼 있는 보고서 전체 아이템 쿼리 실행
   */
  const executeItems = () => {
    const items = selectCurrentItems(store.getState());
    const datasets = selectCurrentDatasets(store.getState());

    items.map((item) => executeItem(_.cloneDeep(item), datasets));
  };

  return {
    generateParameter,
    executeItem,
    executeItems
  };
};

export default useQueryExecute;
