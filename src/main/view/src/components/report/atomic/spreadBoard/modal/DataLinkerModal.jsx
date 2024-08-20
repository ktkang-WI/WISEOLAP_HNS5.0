import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column, Lookup} from 'devextreme-react/data-grid';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import {designerRef} from '../util/SpreadCore';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos} from
  'redux/selector/SpreadSelector';
import {
  positionConverterAsObject,
  positionConverterAsString
} from '../util/spreadUtil';
import useModal from 'hooks/useModal';

const DatasetLinkerModal = ({...props}) => {
  const disptch = useDispatch();
  const [dataSources, setDataSources] = useState([]);
  const {setBindingInfos} = SpreadSlice.actions;
  const datasets = selectCurrentDatasets(store.getState());
  const reportId = selectCurrentReportId(store.getState());
  const {alert} = useModal();
  const bindingInfos = useSelector(selectBindingInfos);
  const designer = designerRef.current.designer;
  const sheetNms = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });
  const datasetNms = datasets.map((dataset) => dataset.datasetNm);

  const booleanMapper = [
    {key: true, value: localizedString.use},
    {key: false, value: localizedString.dontUse}
  ];

  const dataMaker = (datasetId, type) => {
    return bindingInfos[datasetId]?.[type] != undefined ?
      bindingInfos[datasetId]?.[type] : true;
  };

  useEffect(() => {
    const dataSources = datasets.map((dataset) => {
      const datasetId = dataset.datasetId;
      const useHeader = dataMaker(datasetId, 'useHeader');
      const useBorder = dataMaker(datasetId, 'useBorder');
      const useBinding = dataMaker(datasetId, 'useBinding');
      const position = positionConverterAsString(
          // TODO 추후 바인딩 환경설정 추가 시 옵션으로 변경
          /*
          bindingInfos[datasetId]?.columnIndex,
          bindingInfos[datasetId]?.rowIndex
          */
          0,
          0
      );
      return {
        datasetId: datasetId,
        datasetNm: dataset.datasetNm,
        sheetNm: bindingInfos[datasetId]?.sheetNm ?
          bindingInfos[datasetId]?.sheetNm : '',
        position: position,
        useHeader: useHeader,
        useBorder: useBorder,
        useBinding: useBinding
      };
    });
    setDataSources(dataSources);
  }, [bindingInfos]);


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
        useBorder: dataSource.useBorder,
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
    const reg = /^(?:[A-Za-z]{1,2}\d{1,3})?$/;
    if (key === 'position' && !reg.test(value)) {
      alert(localizedString.dataLinkerPosition);
      return;
    }
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
        <Column
          dataField='datasetNm'
          caption={localizedString.datasetName}
          allowEditing={false}
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'datasetNm')}
        >
          <Lookup dataSource={datasetNms} />
        </Column>
        <Column
          dataField='sheetNm'
          caption={localizedString.sheetNm}
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'sheetNm')}>
          <Lookup dataSource={sheetNms} />
        </Column>
        <Column
          dataField='position'
          caption={localizedString.bindingPosition}
          // TODO 추후 바인딩 환경설정 추가 시 옵션으로 변경
          /*
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'position')}
          */
          allowEditing={false}
        />
        <Column
          dataField='useHeader'
          caption={localizedString.useHeader}
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'useHeader')}
        >
          <Lookup
            dataSource={booleanMapper}
            displayExpr={'value'}
            valueExpr={'key'}
          />
        </Column>
        <Column
          dataField='useBorder'
          caption={localizedString.useBoarder}
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'useBorder')}
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
