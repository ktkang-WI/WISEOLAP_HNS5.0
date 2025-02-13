import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {CheckBox, DataGrid} from 'devextreme-react';
import {useState, useEffect, useCallback} from 'react';
import localizedString from 'config/localization';
import {Column} from 'devextreme-react/data-grid';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import useQueryExecute from 'hooks/useQueryExecute';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import store from 'redux/modules';

const theme = getTheme();

const getSummaryName = (data) => {
  const type = data?.summaryType ? data?.summaryType + '_' : '';
  return type + data?.name;
};

const generateDataSource = (dataField, gridAttribute) => {
  return [
    ...dataField.row,
    ...dataField.column,
    ...dataField.measure
  ].map((data) => {
    const summaryName = getSummaryName(data);
    return ({
      ...data,
      type: data.type === 'DIM' ? '차원' : '측정값',
      chartVisibility: gridAttribute?.[summaryName]?.chartVisibility ?? true,
      gridVisibility: gridAttribute?.[summaryName]?.gridVisibility ?? true
    });
  });
};

const generateGridAttribute = (dataSource) => {
  return dataSource.reduce((acc, data) => {
    const summaryName = getSummaryName(data);
    acc[summaryName] = {
      chartVisibility: data.chartVisibility,
      gridVisibility: data.gridVisibility,
      type: data.type
    };
    return acc;
  }, {});
};

const GridAttributeModal = ({
  onClose,
  dataField,
  gridAttribute: initialGridAttribute
}) => {
  const {executeItems} = useQueryExecute();
  const dispatch = useDispatch();
  const designerMode = useSelector(selectCurrentDesignerMode);
  const selectedReportId = useSelector(selectCurrentReportId);
  const [dataSource, setDataSource] = useState([]);
  const [gridAttribute, setGridAttribute] = useState({});

  useEffect(() => {
    const initialDataSource =
    generateDataSource(dataField, initialGridAttribute);
    setDataSource(initialDataSource);
    setGridAttribute(generateGridAttribute(initialDataSource));
  }, [dataField, initialGridAttribute]);

  const handleVisibility = useCallback((e, cellData, property) => {
    const key = cellData.data.name;
    const summaryName = getSummaryName(cellData?.data);
    setGridAttribute((prev) => ({
      ...prev,
      [summaryName]: {
        ...prev[summaryName],
        [property]: !e.value
      }
    }));
    setDataSource((prev) =>
      prev.map((data) =>
        data.name === key ? {...data, [property]: !e.value} : data
      )
    );
  }, []);

  const handleChartVisibility = useCallback((e, cellData) => {
    handleVisibility(e, cellData, 'chartVisibility');
  }, [handleVisibility]);

  const handleGridVisibility = useCallback((e, cellData) => {
    handleVisibility(e, cellData, 'gridVisibility');
  }, [handleVisibility]);

  const onSubmit = useCallback(() => {
    const curItem = selectCurrentItem(store?.getState());
    const param = {
      designerMode: designerMode,
      reportId: selectedReportId,
      gridAttribute: gridAttribute
    };
    if (designerMode === DesignerMode['DASHBOARD']) {
      const curItemId = curItem?.id;
      param.itemId = curItemId;
    }
    // curItemId 필요, pivot meta에 옵션넣기. 차트 표시 여부는 안보이게.
    dispatch(ItemSlice.actions.updateGridAttribute(param));
    executeItems();
  }, [dispatch, selectedReportId, gridAttribute, executeItems]);

  return (
    <Modal
      onSubmit={onSubmit}
      onClose={onClose}
      modalTitle={localizedString.gridAttribute}
      width={theme.size.bigModalWidth}
      height={theme.size.bigModalHeight}
    >
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        allowColumnResizing={true}
      >
        <Column
          dataField="type"
          caption={localizedString.fieldType}
          dataType="string" />
        <Column
          dataField="name"
          caption={localizedString.fieldName}
          dataType="string" />
        <Column
          dataField="caption"
          caption={localizedString.dataItem}
          dataType="string" />
        {designerMode === DesignerMode['AD_HOC'] &&
        <Column
          dataField="chartVisibility"
          caption={localizedString.chartVisibility}
          dataType="boolean"
          cellRender={(cellData) => (
            <CheckBox
              value={cellData.row.data.chartVisibility}
              onValueChanged={(e) => handleChartVisibility(e, cellData)}
            />
          )}
        />}
        <Column
          dataField="gridVisibility"
          caption={localizedString.gridVisibility}
          dataType="boolean"
          cellRender={(cellData) => (
            <CheckBox
              value={cellData.row.data.gridVisibility}
              onValueChanged={(e) => handleGridVisibility(e, cellData)}
            />
          )}
        />
        <Column
          dataField="summaryType"
          caption={localizedString.summaryType}
          dataType="string" />
      </DataGrid>
    </Modal>
  );
};

export default GridAttributeModal;
