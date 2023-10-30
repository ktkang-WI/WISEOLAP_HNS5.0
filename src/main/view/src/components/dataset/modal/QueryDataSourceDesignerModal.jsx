import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
// import meaImg from 'assets/image/icon/dataSource/measure.png';
// import dimImg from 'assets/image/icon/dataSource/dimension.png';
// import folderImg from 'assets/image/icon/report/folder_load.png';
import {Column} from 'devextreme-react/data-grid';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DatasetName from '../atomic/molecules/DatasetName';
import localizedString from '../../../config/localization';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {Scrolling, TreeList} from 'devextreme-react/tree-list';
import {getByQueryDsView, getByQueryValidate, getByTables}
  from 'models/dataset/DSView';
// import Alert from 'components/common/atomic/Modal/organisms/Alert';

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

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, orgDataset={}, query='', ...props
}) => {
  // const isNew = _.isEmpty(dataset);
  const dispatch = useDispatch();
  const {insertDataset} = DatasetSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const queryEditorRef = useRef();
  const [dataset, setDataset] = useState(orgDataset);
  const [datasource, setDatasource] = useState('');
  const [inputQuery, setQuery] = useState('');

  useEffect(() => {
    const tableList = getByTables(selectedDataSource)
        .then((response) => {
          const tables = response.tables.rowData;
          const columns = response.columns.rowData;

          const tableList = tables.map((tbl) => {
            return {...tbl, column: columns.filter(
                (col) => col.TBL_NM == tbl.id
            )};
          });

          return tableList;
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });

    setDatasource(tableList);
  }, []);

  const store = {
    load(loadOptions) {
      return datasource;
    }
  };

  useEffect(() => {
    if (!_.isEmpty(dataset)) {
      // TODO: 기존 데이터 집합 수정하는 경우!!
    } else {
      setDataset({
        datasetNm: localizedString.defaultDatasetName,
        datsetType: 'DS_SQL',
        datasrcId: selectedDataSource.dsId
      });
    }
  }, []);

  return (
    <Modal
      onSubmit={() => {
        // 쿼리 확인 -> 백 OR 프론트, 아무 곳이에서 유효성 검사?
        // 1. 쿼리 빈칸, 2. 데이터 집합 명 빈칸, 3. 데이터 집합 명 겹침.
        // 4. 쿼리 문법 안 맞음. 등등.
        console.log(inputQuery);
        if (!inputQuery || inputQuery == '') {
          // Alert();
          console.log('쿼리 입력 하세요');
          // return false; // 확인 누르고 유효성 검사 실패 해도 팝업 닫힘. 확인 필요.
        } else if (!dataset || dataset == '') {
          console.log('데이터 집합 명 입력 하세요');
        } else if (false) { // 백단에서 쿼리 문법 검사. 및 데이터 가져옴.
          console.log('동일한 데이터 집합 명이 존재 합니다.');
        } else if (false) { // 백단에서 쿼리 문법 검사. 및 데이터 가져옴.
          if (getByQueryValidate()) {
            getByQueryDsView();

            dispatch(insertDataset({
              reportId: selectedReportId,
              dataset: {
                ...dataset,
                datasetQuery: queryEditorRef.current.editor.getValue(),
                fields: tempFields
              }
            }));
          } else {
            console.log('쿼리가 부적합 합니다.');
            return false;
          }
        }
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.datasetDesigner}
      {...props}
    >
      <RowWrapper>
        <ColumnWrapper>
          <ModalPanel
            title={localizedString.dataSourceInfo}
            width='300px'
            height='250px'
            padding='10'>
            <DataSourceInfoForm
              compact={true}
              selectedDataSource={selectedDataSource}
            />
          </ModalPanel>
          <ModalPanel
            title={localizedString.dataItem}
            height='400px'
            width='300px'
            padding='10'>
            <TreeList
              dataSource={store}
              remoteOperations={true}
              showColumnHeaders={false}
              searchPanel={{
                visible: true,
                searchVisibleColumnsOnly: true,
                highlightSearchText: true,
                width: '100%'
              }}
              expandNodesOnFiltering={false}
              filterMode='matchOnly'
              keyExpr='id'
              hasItemsExpr='hasItems'
              dataStructure="tree"
              height='100%'
              itemsExpr='column'
            >
              <Scrolling mode='virtual'/>
              <Column dataField='id' width="100%">
              </Column>
            </TreeList>
          </ModalPanel>
        </ColumnWrapper>
        <ColumnWrapper>
          <DatasetName
            name={dataset.datasetNm || ''}
            onChangedValue={(datasetNm) => {
              setDataset({...dataset, datasetNm});
            }}
          />
          <ModalPanel title={localizedString.query} height='100%' padding='10'>
            <QueryEditor editorRef={queryEditorRef}
              setQuery={setQuery} text={inputQuery}
            />
          </ModalPanel>
          <ModalPanel
            title={localizedString.parameter}
            height='300px'
            padding='10'>
            <CommonDataGrid>
              <Column caption={localizedString.parameterName}/>
              <Column caption={localizedString.parameterCaption}/>
              <Column caption={localizedString.dataType}/>
              <Column caption={localizedString.parameterType}/>
              <Column caption='Visible'/>
              <Column caption={localizedString.multiSelect}/>
              <Column caption={localizedString.order}/>
              <Column caption={localizedString.conditionName}/>
            </CommonDataGrid>
          </ModalPanel>
        </ColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
