import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {DataGrid} from 'devextreme-react';
import {Column} from 'devextreme-react/data-grid';
import {useMemo, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import localizedString from 'config/localization';

const theme = getTheme();

const ViewerPostingDataModal = (
    {fields, datasetId, selectRowKeys, appliedDataItem, ...props}
) => {
  const {viewerPostingUpdate} = DatasetSlice.actions;
  const dispatch = useDispatch();
  const currReportId = useSelector(selectCurrentReportId);
  const ref = useRef(null);
  const allRows = fields.map(
      (data) => data.uniqueName
  );

  const dataSource = useMemo(() => {
    return fields.filter((item) => !appliedDataItem.includes(item.uniqueName));
  }, [fields, appliedDataItem]);

  const onContentReady = (e) => {
    ref.current.instance.selectAll();

    let deselectRowKeys = [];

    if (selectRowKeys.length != 0) {
      deselectRowKeys = selectRowKeys.reduce((acc, key) => {
        if (!key.check && !appliedDataItem.includes(key.uniNm)) {
          acc.push(key.uniNm);
        }
        return acc;
      }, []);
    }
    // deselect
    ref.current.instance.deselectRows(deselectRowKeys);
  };


  const onSubmit = () => {
    let tmpSelectRows = ref.current.instance.getSelectedRowKeys();

    if (appliedDataItem.length != 0) {
      tmpSelectRows = tmpSelectRows.concat(appliedDataItem);
    }

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
      modalTitle={localizedString.showInViewerDataItems}
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
        onContentReady={(e) => onContentReady(e)}
        keyExpr="uniqueName"
        allowColumnResizing={true}
      >
        <Column
          dataField='name'
          caption={localizedString.columnLogicalName}
        />
        <Column
          dataField='uniqueName'
          caption={localizedString.uniqueName}
        />
        <Column
          dataField='type'
          caption={localizedString.types}
        />
      </DataGrid>
    </Modal>
  );
};
export default ViewerPostingDataModal;
