import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column, Lookup} from 'devextreme-react/data-grid';
import useSpread from 'hooks/useSpread';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentDesigner} from
  'redux/selector/SpreadSelector';

const DatasetLinkerModal = ({...props}) => {
  const disptch = useDispatch();
  const designer = useSelector(selectCurrentDesigner);
  const [dataSources, setDataSources] = useState([]);
  const {setBindingInfos} = SpreadSlice.actions;
  const {positionConverterAsObject, positionConverterAsString} = useSpread();
  const datasets = selectCurrentDatasets(store.getState());
  const reportId = selectCurrentReportId(store.getState());
  const sheetNmRef = useRef();
  const positionRef = useRef();
  const sheetNms = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });

  const booleanMapper = [
    {key: true, value: '표시'},
    {key: false, value: '표시안함'}
  ];

  useEffect(() => {
    const bindingInfos = selectBindingInfos(store.getState());
    if (_.isEmpty(bindingInfos)) {
      const dataSources = datasets.map((dataset) => {
        return {
          datasetId: dataset.datasetId,
          datasetNm: dataset.datasetNm,
          sheetNm: undefined,
          position: undefined,
          useHeader: false,
          useBoarder: false,
          useBinding: false
        };
      });
      setDataSources(dataSources);
    } else {
      const dataSources = Object.keys(bindingInfos).map((datasetId) => {
        const position = positionConverterAsString(
            bindingInfos[datasetId].columnIndex,
            bindingInfos[datasetId].rowIndex);
        return {
          datasetId: datasetId,
          datasetNm: bindingInfos[datasetId].datasetNm,
          sheetNm: bindingInfos[datasetId].sheetNm,
          position: position,
          useHeader: bindingInfos[datasetId].useHeader,
          useBoarder: bindingInfos[datasetId].useBoarder,
          useBinding: bindingInfos[datasetId].useBinding
        };
      });
      setDataSources(dataSources);
    }
  }, []);

  const onSubmit = useCallback(() => {
    const returnObj = {};
    dataSources.map((dataSource) => {
      const colNRow = positionConverterAsObject(dataSource.position);
      returnObj[dataSource.datasetId] = {
        datasetNm: dataSource.datasetNm,
        sheetNm: dataSource.sheetNm,
        columnIndex: colNRow.columnIndex,
        rowIndex: colNRow.rowIndex,
        useHeader: dataSource.useHeader,
        useBoarder: dataSource.useBoarder,
        useBinding: createUseBind(dataSource)
      };
      return null;
    });
    disptch(setBindingInfos({
      reportId: reportId,
      bindingInfos: returnObj
    }));
  }, [dataSources]);

  const createUseBind = (dataSource) => {
    if (_.isEmpty(dataSource.sheetNm) || _.isEmpty(dataSource.position)) {
      return false;
    } else {
      return true;
    }
  };

  const updateDataSources = (value, currentRowData, key) => {
    const newDataSources = _.cloneDeep(dataSources);
    newDataSources.map((dataSource) => {
      if (dataSource.datasetNm === currentRowData.datasetNm) {
        dataSource[key] = value;
      }
    });
    setDataSources(newDataSources);
  };

  return (
    <Modal
      modalTitle={localizedString.datasetBinding}
      height='300px'
      width='700px'
      onSubmit={onSubmit}
      {...props}
    >
      <CommonDataGrid
        dataSource={dataSources}
        useFilter={false}
        repaintChangesOnly={true}
        editing={{
          allowUpdating: true,
          mode: 'cell'
        }}
      >
        <Column dataField='datasetNm' caption='데이터 집합 명' allowEditing={false}/>
        <Column dataField='sheetNm' caption='Sheet 명' setCellValue={
          (newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'sheetNm')}>
          <Lookup dataSource={sheetNms} />
        </Column>
        <Column dataField='position' caption='데이터 연동 위치'setCellValue={
          (newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'position')}/>
        <Column
          dataField='useHeader'
          caption='헤더 표시 여부'
        >
          <Lookup
            dataSource={booleanMapper}
            displayExpr={'value'}
            valueExpr={'key'}
          />
        </Column>
        <Column
          dataField='useBoarder'
          caption='테두리 표시 여부'
        >
          <Lookup
            dataSource={booleanMapper}
            displayExpr={'value'}
            valueExpr={'key'}
          />
        </Column>
      </CommonDataGrid>
    </Modal>
  );
};

export default DatasetLinkerModal;
