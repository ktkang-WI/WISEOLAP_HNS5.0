import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column, Lookup} from 'devextreme-react/data-grid';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentDesigner} from
  'redux/selector/SpreadSelector';
import {
  positionConverterAsObject,
  positionConverterAsString
} from '../util/spreadUtil';
import useModal from 'hooks/useModal';

const DatasetLinkerModal = ({...props}) => {
  const disptch = useDispatch();
  const designer = selectCurrentDesigner(store.getState());
  const [dataSources, setDataSources] = useState([]);
  const {setBindingInfos} = SpreadSlice.actions;
  const datasets = selectCurrentDatasets(store.getState());
  const reportId = selectCurrentReportId(store.getState());
  const {alert} = useModal();
  const bindingInfos = useSelector(selectBindingInfos);
  const sheetNms = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });

  const booleanMapper = [
    {key: true, value: '표시'},
    {key: false, value: '표시안함'}
  ];

  useEffect(() => {
    if (_.isEmpty(bindingInfos)) {
      const dataSources = datasets.map((dataset) => {
        return {
          datasetId: dataset.datasetId,
          datasetNm: dataset.datasetNm,
          sheetNm: undefined,
          position: undefined,
          useHeader: false,
          useBorder: false,
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
          useBorder: bindingInfos[datasetId].useBorder,
          useBinding: bindingInfos[datasetId].useBinding
        };
      });
      setDataSources(dataSources);
    }
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
        <Column dataField='datasetNm' caption='데이터 집합 명' allowEditing={false}/>
        <Column
          dataField='sheetNm'
          caption='Sheet 명'
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'sheetNm')}>
          <Lookup dataSource={sheetNms} />
        </Column>
        <Column
          dataField='position'
          caption='데이터 연동 위치'
          setCellValue={(newData, value, currentRowData) =>
            updateDataSources(value, currentRowData, 'position')}
        />
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
          dataField='useBorder'
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
