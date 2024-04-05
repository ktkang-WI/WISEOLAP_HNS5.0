import Modal from 'components/common/atomic/Modal/organisms/Modal';
import SingleTableInfoForm from '../atomic/molecules/SingleTableInfoForm';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {
  useDispatch,
  useSelector} from 'react-redux';
import {useState} from 'react';
import _ from 'lodash';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DatasetName from '../atomic/molecules/DatasetName';
import localizedString from '../../../config/localization';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import models from 'models';
import useModal from 'hooks/useModal';
import {selectCurrentDatasets, selectDatasetQuantity}
  from 'redux/selector/DatasetSelector';
import EditParamterModal from './EditParamterModal';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import ParameterSlice from 'redux/modules/ParameterSlice';
import DatasetType from '../utils/DatasetType';
import {makeFieldIcon} from '../utils/DatasetUtil';
import TableColumnList from '../atomic/molecules/TableColumnList';

const theme = getTheme();

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & + & {
    border-left: 1px solid ${theme.color.breakLine};
  }
`;
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const SingleTableDesignerModal = ({
  onSubmit, selectedDataSource, selectedTable, columns,
  orgDataset, onClose, query='', ...props
}) => {
  const defaultDataset = {
    datasetNm: selectedTable.TBL_NM,
    datasetType: DatasetType.DS_SINGLE,
    dataSrcId: selectedDataSource.dsId,
    datasetQuery: ''
  };

  const datasetTableInfo = {
    dsType: localizedString.addDsSingle,
    tableNm: selectedTable.TBL_NM,
    dsNm: selectedDataSource.dsNm,
    dbAddress: selectedDataSource.ip,
    dbNm: selectedDataSource.dbNm,
    dbmsType: selectedDataSource.dbmsType
  };

  // hook
  const {openModal, alert} = useModal();
  const dispatch = useDispatch();

  // actions
  const {updateDataset} = DatasetSlice.actions;
  const {updateParameterInformation} = ParameterSlice.actions;

  // selector
  const selectedReportId = useSelector(selectCurrentReportId);
  const datasets = useSelector(selectCurrentDatasets);
  const parameters = useSelector(selectRootParameter);
  const datasetQuantity = useSelector(selectDatasetQuantity);

  // local
  const datasetId = orgDataset ?
    orgDataset.datasetId : 'dataset' + (datasetQuantity + 1);

  const columnAllCheckBox = [{
    text: `[${localizedString.visibility}] ${localizedString.selectAll}`,
    onValueChanged: (e) => {
      const setVisible = () => {
        if (!columnList) return;
        return columnList.map((col) => {
          const tempCol = _.cloneDeep(col);
          tempCol.visibility = e.value;
          return tempCol;
        });
      };
      setColumList(setVisible());
    }
  }];

  // state
  const [dataset, setDataset] =
      useState(_.cloneDeep(orgDataset || defaultDataset));
  const [paramInfo, setParamInfo] = useState(parameters.informations
      .filter((i) => i.dataset.includes(datasetId)));
  const [columnList, setColumList] = useState(columns);


  const editParameter = {
    text: '매개변수',
    onClick: () => {
      openModal(EditParamterModal, {
        parameterInfo: paramInfo,
        onSubmit: (p) => {
          setParamInfo(p);
          dispatch(updateParameterInformation({
            datasetId: dataset.datasetId,
            reportId: selectedReportId,
            informations: p
          }));
        }
      });
    }
  };

  const paramterButtons =
      paramInfo.length > 0 ? [editParameter] : [];

  const generateWhereValue = (sqlData) => {
    sqlData = sqlData + '\nWHERE 1=1 \n';
    paramInfo.forEach((param) => {
      switch (param.operation) {
        case 'IN':
        case 'Equals':
          sqlData += ' AND A.' + param.uniqueName +
              ' IN (' + param.name + ') \n';
          break;
        case 'Not In':
          sqlData += ' AND A.' + param.uniqueName +
              'NOT IN (' + param.name + ') \n';
          break;
        case 'Between':
          sqlData += ' AND A.' + param.uniqueName +
              'BETWEEN (' + param.name + ') \n';
          break;
      }
    });
    return sqlData;
  };

  return (
    <Modal
      onSubmit={async () => {
        const dupleCheck = datasets.find((ds) =>
          ds.datasetNm == dataset.datasetNm && ds.datasetId != datasetId);

        if (!dataset.datasetNm || dataset.datasetNm == '') {
          alert('데이터 집합 명을 입력해 주세요.');
        } else if (dupleCheck) {
          alert('중복된 데이터 집합 명입니다. 다시 입력해 주세요.');
        } else {
          const parameters = {
            informations: paramInfo,
            values: {}
          };

          models.SingleTable.getSingleTableQuery(
              selectedDataSource.dsId,
              columnList,
              parameters)
              .then(({data}) => {
                const sqlData = generateWhereValue(data);
                const onlyVisibleColumn = [];
                columnList.map((row) => {
                  if (row.visibility) onlyVisibleColumn.push(row);
                });

                const tempFields = makeFieldIcon(onlyVisibleColumn);

                dispatch(updateDataset({
                  reportId: selectedReportId,
                  dataset: {
                    ...dataset,
                    datasetId: datasetId,
                    datasetQuery: sqlData,
                    fields: tempFields,
                    columnList: columnList,
                    tableInfo: selectedTable
                  }
                }));
                onClose();
              });
        }
        return true;
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.addDsSingle}
      onClose={onClose}
      {...props}
    >
      <RowWrapper>
        <ColumnWrapper>
          <ModalPanel
            title={localizedString.dataSourceInfo}
            width='300px'
            height='250px'
            padding='10'>
            <SingleTableInfoForm
              compact={true}
              selectedDataSource={datasetTableInfo}
            />
          </ModalPanel>
        </ColumnWrapper>
        <ColumnWrapper>
          <DatasetName
            name={dataset.datasetNm || ''}
            onValueChanged={(datasetNm) => {
              setDataset({...dataset, datasetNm});
            }}
          />
          <ModalPanel
            title={localizedString.addDsSingle}
            headerButtons={paramterButtons}
            headerCheckBoxs={columnAllCheckBox}
            height='90%'
            padding='10'>
            <TableColumnList
              compact={false}
              dataSource={columnList}
              keyExpr='ID'
              selection={{mode: 'single'}}
              onSelectionChanged={(e) => {
              }}
              onRowUpdated={(columns) => {
                const changeColumnList = columnList.map((row) => {
                  if (columns.key == row.ID) {
                    columns.data.columnName = columns.data.COL_CAPTION;
                    row = columns.data;
                  }
                  return row;
                });
                setColumList(changeColumnList);
              }}
            />
          </ModalPanel>
        </ColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default SingleTableDesignerModal;
