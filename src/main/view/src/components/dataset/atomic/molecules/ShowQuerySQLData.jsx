import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ViewQueryFilterBar from './ViewQueryFilterBar';
import {DataGrid} from 'devextreme-react';
import play from 'assets/image/icon/button/play.png';
import download from 'assets/image/icon/button/download.png';
import localizedString from '../../../../config/localization';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import models from 'models';
import useQueryExecute from 'hooks/useQueryExecute';
import useModal from 'hooks/useModal';
import {Workbook} from 'exceljs';
import {exportDataGrid} from 'devextreme/excel_exporter';

const ShowQuerySQLData = ({dsId, datasetQuery, paramInfo}) => {
  const {alert} = useModal();
  const {initializeParameters} = useQueryExecute();

  useEffect(() => {
    // eslint-disable-next-line max-len
    initializeParameters(state, setDefaultValue, setValues);
  }, []);

  const [state, setState] = useState(
      {
        informations: paramInfo,
        values: {},
        filterSearchComplete: []
      }
  );
  const [dataSource, setDataSource] = useState();

  const dataGridRef = useRef();

  const setDefaultValue = useCallback((name, value) => {
    setParameterValues({
      values: {[name]: {
        value
      }}
    });
    filterSearchComplete({id: name});
  }, [state]);

  const setValues = useCallback((name, values) => {
    setParameterValues({values: {[name]: values}});
    filterSearchComplete({id: name});
  }, [state]);

  const setParameterValues = useCallback(({values}) => {
    const newValue = {
      informations: state.informations,
      values: Object.assign(state.values, values),
      filterSearchComplete: state.filterSearchComplete
    };
    setState(newValue);
  }, [state]);

  const filterSearchComplete = useCallback(({id}) => {
    const filterId = id;
    const newFilterSearchComplete = {
      informations: state.informations,
      values: state.values,
      // eslint-disable-next-line max-len
      filterSearchComplete: state.filterSearchComplete.concat([filterId])
    };
    setState(newFilterSearchComplete);
  }, [state]);

  const onValueChanged = useCallback((id, value, index) => {
    const values = state.values[id];
    if (!values || values.value[index] == value) return;
    values.value[index] = value;
    setParameterValues({values: {[id]: values}});

    for (const key in state.values) {
      if (state.values[key].linkageFilter) {
        const linkageFilter = state.values[key].linkageFilter;
        if (linkageFilter.find((filter) => filter == id)) {
          const param = state.informations.
              find((info) => info.name == key);
          executeLinkageFilter(param, linkageFilter).then((values) => {
            setParameterValues({
              values: {[param.name]: values}
            });

            for (const idx in values.value) {
              if (state.values[key].value[idx] != values.value[idx]) {
                onValueChanged(param.name, values.value[idx], idx);
              }
            }
          }).catch((e) => {
            console.log(e);
          });
        }
      }
    }
  }, [state]);

  const executeSQL = async () => {
    const parameters = {
      informations: state.informations,
      values: state.values
    };

    try {
      // eslint-disable-next-line max-len
      const response = await models.DBInfo.getExecuteQueryData(dsId, datasetQuery, parameters);

      if (response.status !== 200) {
        alert(localizedString.invalidQuery);
        return;
      }

      const rowData = response.data.rowData;

      if (rowData[0]?.error) {
        alert(localizedString.invalidQuery);
        return;
      }

      setDataSource(rowData);

      if (rowData.length >= 100) {
        alert(localizedString.executeSQLAlert);
      }
    } catch (error) {
      // alert(localizedString.invalidQuery);
    }
  };

  const exportSQL = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('SQL sheet');
    const dataGridInstance = dataGridRef.current.instance;

    if (!dataGridInstance.getDataSource()) {
      alert(`쿼리 실행 ${localizedString.noneData}`);
      return;
    }

    exportDataGrid({
      component: dataGridInstance,
      worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        // eslint-disable-next-line max-len
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), 'SQL_Data.xlsx');
      }).catch((e) => {
        console.log(e);
      });
    }).catch((e) => {
      console.log(e);
    });
  };

  return (
    <Wrapper>
      <Wrapper
        display={'flex'}
        alignItems={'center'}
        height={'50px'}
        padding={'5px'}
      >
        <CommonButton
          title={localizedString.executeSQL}
          width={'85px'}
          height={'30px'}
          type={'whiteRound'}
          onClick={executeSQL}
        >
          <img src={play}/>
          {localizedString.executeSQL}
        </CommonButton>
        <CommonButton
          title={localizedString.exportSQL}
          width={'85px'}
          height={'30px'}
          type={'whiteRound'}
          onClick={exportSQL}
        >
          <img src={download}/>
          {localizedString.exportSQL}
        </CommonButton>
      </Wrapper>
      <Wrapper
        height={'calc(100% - 50px)'}
        padding={'5px'}
        display={'flex'}
        direction={'column'}
      >
        <ViewQueryFilterBar
          state={state}
          onValueChanged={onValueChanged}
        />
        <Wrapper
          height={'100%'}
          style={{
            minHeight: '0px'
          }}
          margin={'15px 0px 0px 0px'}
        >
          <DataGrid
            ref={dataGridRef}
            showBorders={true}
            dataSource={dataSource}
            width={'100%'}
            height={'100%'}
            allowColumnResizing={true}
          />
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ShowQuerySQLData);
