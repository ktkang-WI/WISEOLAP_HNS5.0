import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
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
import {getDataByQueryMart, getTablesByMart}
  from 'models/dataset/DBInfo';
import useModal from 'hooks/useModal';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';

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
  const {openModal} = useModal();
  const dispatch = useDispatch();
  const {insertDataset} = DatasetSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const datasets = useSelector(selectCurrentDatasets);
  const queryEditorRef = useRef();
  const editorRef = queryEditorRef.current;
  const [dataset, setDataset] = useState(orgDataset);
  const [datasource, setDatasource] = useState('');

  useEffect(() => {
    getTablesByMart(selectedDataSource)
        .then((response) => {
          const tables = response.tables.rowData;
          const columns = response.columns.rowData;

          const tableList = tables.concat(columns);

          setDatasource(tableList);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    if (!_.isEmpty(dataset)) {
      // TODO: 기존 데이터 집합 수정하는 경우!!
    } else {
      setDataset({
        datasetNm: localizedString.defaultDatasetName,
        datasetType: 'DS_SQL',
        dataSrcId: selectedDataSource.dsId
      });
    }
  }, []);

  const displayCaption = (data) => {
    let caption = '';
    if (!data.COL_NM) {
      caption = data.TBL_CAPTION == null ? data.TBL_NM : data.TBL_CAPTION;
    } else {
      caption = data.COL_CAPTION == null ? data.COL_NM : data.COL_CAPTION;
    }

    return caption;
  };

  return (
    <Modal
      onSubmit={async () => {
        const query = editorRef.editor.getValue();
        const dupleCheck =
          datasets.find((name) => name.datasetNm == dataset.datasetNm);

        if (!query || query == '') { // 쿼리 빈값 확인.
          openModal(Alert, {
            message: '쿼리를 입력해 주세요.'
          });
        } else if (!dataset.datasetNm || dataset.datasetNm == '') {
          openModal(Alert, { // 데이터 집합 명 빈값 확인.
            message: '데이터 집합 명을 입력해 주세요.'
          });
        } else if (dupleCheck) { // 데이터 집합 명 중복 검사.
          openModal(Alert, {
            message: '중복된 데이터 집합 명입니다. 다시 입력해 주세요.'
          });
        } else { // 백단에서 쿼리 검사 및 데이터 가져옴.
          const response = await getDataByQueryMart(selectedDataSource, query);
          if (!response.rowData[0].error) {
            const types = ['int', 'NUMBER', 'decimal'];
            let tempFields = response.metaData;

            tempFields = tempFields.map((field) => {
              const type = types.includes(field.columnTypeName);
              return {
                icon: type ? meaImg : dimImg,
                parentId: '0',
                uniqueName: field.columnName,
                name: field.columnName,
                type: type ? 'MEASURE' : 'DIMENSION',
                ...field
              };
            });

            tempFields.unshift({
              name: localizedString.defaultDatasetName,
              type: 'FLD',
              uniqueName: '0',
              icon: folderImg
            });

            dispatch(insertDataset({
              reportId: selectedReportId,
              dataset: {
                ...dataset,
                datasetQuery: query,
                fields: tempFields
              }
            }));

            return;
          } else {
            openModal(Alert, {
              message: '쿼리가 부적절 합니다. 다시 입력해 주세요.'
            });
          }

          return true;
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
            height='calc(100% - 250px)'
            width='300px'
            padding='10'>
            <TreeList
              height='100%'
              dataSource={datasource}
              showColumnHeaders={false}
              searchPanel={{
                visible: true,
                searchVisibleColumnsOnly: true,
                highlightSearchText: true,
                width: '280px'
              }}
              rootValue={-1}
              expandNodesOnFiltering={false}
              filterMode='matchOnly'
              keyExpr='ID'
              parentIdExpr='PARENT_ID'
            >
              <Scrolling mode='standard'/>
              <Column
                dataField='ID'
                width="100%"
                calculateDisplayValue={displayCaption}
              >
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
            <QueryEditor
              editorRef={queryEditorRef}
              value={editorRef && editorRef.editor.getValue()}/>
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
