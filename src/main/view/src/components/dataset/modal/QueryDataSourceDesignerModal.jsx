import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import {TreeView} from 'devextreme-react';
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
import CustomStore from 'devextreme/data/custom_store';
import localizedString from '../../../config/localization';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

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

  const store = new CustomStore({
    key: 'id',
    load: (loadOptions) => {
      console.log(loadOptions);
    }
  });

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

  return (
    <Modal
      onSubmit={() => {
        // 쿼리 확인
        // 쿼리 확인 겸 필드 가져온 뒤 가공
        let tempFields = [
          {name: '금액', type: 'mea', dataType: 'number'},
          {name: '소계', type: 'mea', dataType: 'number'},
          {name: '생산회사이름', type: 'dim', dataType: 'varchar'},
          {name: '자동차명', type: 'dim', dataType: 'varchar'},
          {name: '결재구분명', type: 'dim', dataType: 'varchar'}
        ];

        tempFields = tempFields.map((field) => {
          return {
            icon: field.type == 'mea' ? meaImg : dimImg,
            parentId: '0',
            uniqueName: field.name,
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
            datasetQuery: queryEditorRef.current.editor.getValue(),
            fields: tempFields
          }
        }));
        // return true;
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
            height='100%'
            width='300px'
            padding='10'>
            <TreeView
              dataSource={store}
              remoteOperations={true}
              searchPanel={{
                visible: true,
                searchVisibleColumnsOnly: true,
                highlightSearchText: true,
                width: '100%'
              }}
              expandNodesOnFiltering={false}
              filterMode='matchOnly'
              keyExpr='id'
              parentIdExpr='parent'
              hasItemsExpr='hasItems'
            >
            </TreeView>
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
            <QueryEditor editorRef={queryEditorRef}/>
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
