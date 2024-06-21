import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {dataFieldTypeOfItemTypeFunc}
  from 'components/report/item/util/dataFieldType';
import {getTheme} from 'config/theme';
import {DataGrid} from 'devextreme-react';
import {Column} from 'devextreme-react/data-grid';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectCurrentDataField,
  selectRootItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const ViewerPostingDataModal = (
    {fields, datasetId, selectRowKeys, ...props}
) => {
  const {viewerPostingUpdate} = DatasetSlice.actions;
  const dispatch = useDispatch();
  const currReportId = useSelector(selectCurrentReportId);
  const rootItem = useSelector(selectRootItem);
  const currDatafield = useSelector(selectCurrentDataField);
  const ref = useRef(null);
  const dataSource = fields;
  const allRows = dataSource.map(
      (data) => data.uniqueName
  );
  const items = rootItem.adHocOption || rootItem.items;
  const onContentReady = (e) => {
    console.log(items);
    console.log(currDatafield);
    // console.log(dataFieldTypeOfItemTypeFunc('chart'));
    ref.current.instance.selectAll();

    // field에 올라간 데이터는 무조건 선택. 조회시 최종 검사.
    if (rootItem.adHocOption) {
    } else {
      //  추후 utility.js에서 ------
      // 아이템 types(차트, 피벗 등등)
      // 아이템 types를 기반으로 dataFieldType(+정렬 항목) 가져오기(dataFieldType은 중복 추가 x)
      // -------
      const sameDatasetItems = items.filter((i) =>
        i.meta.dataField.datasetId == datasetId
      );
      const types = sameDatasetItems.map((i) => i.type);
      const tmpFieldKeys = types.map((type, idx) => {
        return dataFieldTypeOfItemTypeFunc(type);
      });
      // const fieldKeys = new Set(tmpFieldKeys); // 중복 제거
      // 현재 datasetId만 사용된 아이템의 meta에서 dataFields에 있는 데이터의 uniqueName 가져옴.

      const item = sameDatasetItems.reduce((acc, item, idx) => {
        for (let i = 0; i < tmpFieldKeys[idx].length; i++) {
          acc.push(...item.meta.dataField[tmpFieldKeys[idx][i]]);
        }
        return acc;
      }, []);

      // 중복된 uniqueName 제거
      const fieldsOnlyKeys = new Set(item.map((field) => field.uniqueName));
      const uniNmArr = Array.from(fieldsOnlyKeys);

      // 가져온 uniqueName이 있으면 선택 true. onCellClick에서 해제 불가하게.
      // fieldsGroup -> 추후 이름 변경. select된 데이터 저장(redux)
      let deselectRowKeys = [];

      if (selectRowKeys.length != 0) {
        deselectRowKeys = selectRowKeys.reduce((acc, key) => {
          if (!key.check && !uniNmArr.includes(key.uniNm)) {
            acc.push(key.uniNm);
          }
          return acc;
        }, []);
      }
      // deselect
      ref.current.instance.deselectRows(deselectRowKeys);
    }
  };

  const onSubmit = () => {
    const tmpSelectRows = ref.current.instance.getSelectedRowKeys();
    const deselect = allRows.filter((data) => !tmpSelectRows.includes(data));
    let selectedRows = [];

    if (tmpSelectRows.length == 0) {
      selectedRows = allRows.map((row) => {
        return {uniNm: row, check: false};
      });
    } else {
      selectedRows = allRows.map((row) => {
        if (tmpSelectRows.includes(row)) {
          return {uniNm: row, check: true};
        } else if (deselect.includes(row)) {
          return {uniNm: row, check: false};
        }
      });
    }

    const param = {
      reportId: currReportId,
      datasetId: datasetId,
      fields: selectedRows
    };

    dispatch(viewerPostingUpdate(param));
  };

  return (
    <Modal
      width={theme.size.bigModalWidth}
      height={theme.size.bigModalHeight}
      modalTitle={'뷰어 데이터 항목 표시'}
      onClose={() => props.onClose()}
      onSubmit={() => onSubmit()}
    >
      {/* 그리드 형식으로 */}
      <DataGrid
        id='viewer_posting'
        ref={ref}
        dataSource={dataSource}
        showBorders={true}
        height={'90%'}
        selection={{mode: 'multiple'}}
        onContentReady={(e) => onContentReady(e)} // onRowPrepared ??
        keyExpr="uniqueName"
      >
        <Column
          dataField='name'
        />
        <Column
          dataField='uniqueName'
        />
        <Column
          dataField='type'
        />
      </DataGrid>
    </Modal>
  );
};
export default ViewerPostingDataModal;
