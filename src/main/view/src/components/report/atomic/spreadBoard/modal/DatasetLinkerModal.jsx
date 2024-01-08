import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column, Lookup} from 'devextreme-react/data-grid';
import useSpread from 'hooks/useSpread';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import store from 'redux/modules';
import SpreadSlice from 'redux/modules/SpreadSlice';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectBindingInfos, selectCurrentDesigner} from
  'redux/selector/SpreadSelector';

const DatasetLinkerModal = ({...props}) => {
  const designer = useSelector(selectCurrentDesigner);
  const {setBindingInfos} = SpreadSlice.actions;
  const disptch = useDispatch();
  const [dataSources, setDataSources] = useState([]);
  const reportId = selectCurrentReportId(store.getState());
  const {positionConverterAsObject} = useSpread();
  const sheetNames = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });

  const booleanMapper = [
    {key: true, value: '표시'},
    {key: false, value: '표시안함'}
  ];

  useEffect(() => {
    const datasets = selectCurrentDatasets(store.getState());
    const bindingInfos = selectBindingInfos(store.getState());
    if (_.isEmpty(bindingInfos)) {
      const dataSources = datasets.map((dataset) => {
        return {
          datasetNm: dataset.datasetNm,
          sheetName: undefined,
          useHeader: false,
          useBoarder: false
        };
      });
      setDataSources(dataSources);
    } else {
      const dataSources = Object.keys(bindingInfos).map((datasrcId) => {
        return {
          datasetNm: bindingInfos[datasrcId].datasetNm,
          sheetName: bindingInfos[datasrcId].sheetName,
          useHeader: bindingInfos[datasrcId].useHeader,
          useBoarder: bindingInfos[datasrcId].useBoarder
        };
      });
      setDataSourcs(dataSources);
    }
  }, []);

  const onSubmit = useCallback(() => {
    const returnObj = {};
    dataSources.map((dataSource) => {
      const colNRow = positionConverterAsObject(dataSource.position);
      returnObj[dataSource.datasrcId] = {
        columnIndex: colNRow.columnIndex,
        rowIndexIndex: colNRow.rowIndex,
        sheetName: dataSource.sheetName,
        useHeader: dataSource.useHeader,
        useBoarder: dataSource.useBoarder,
        usebinding: createUseBind(dataSource)
      };
      return null;
    });
    disptch(setBindingInfos({
      reportId: reportId,
      bindingInfos: returnObj
    }));
  }, [dataSources]);

  const createUseBind = (dataSource) => {
    if (dataSource.sheetName === '' || dataSource.sheetName === null ||
     dataSource.position === '' || dataSource.position === null) {
      return false;
    } else {
      return true;
    }
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
        editing={{
          allowUpdating: true,
          mode: 'cell'
        }}
      >
        <Column dataField='datasetNm' caption='데이터 집합 명' allowEditing={false}>
          <Lookup dataSource={sheetNames} />
        </Column>
        <Column dataField='sheetName' caption='Sheet 명'>
          <Lookup dataSource={sheetNames} />
        </Column>
        <Column dataField='position' caption='데이터 연동 위치'/>
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
