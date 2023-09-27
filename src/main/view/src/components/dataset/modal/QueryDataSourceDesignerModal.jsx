import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import {TreeView} from 'devextreme-react';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import {Column} from 'devextreme-react/data-grid';
import ReportSlice from 'redux/modules/ReportSlice';
import {useDispatch} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DatasetName from '../atomic/molecules/DatasetName';

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
  const {insertDataset} = ReportSlice.actions;
  const queryEditorRef = useRef();
  const [dataset, setDataset] = useState(orgDataset);

  useEffect(() => {
    if (!_.isEmpty(dataset)) {
      // TODO: 기존 데이터 집합 수정하는 경우!!
    } else {
      setDataset({
        datasetNm: '데이터집합',
        datsetType: 'DS_SQL',
        datasrcId: selectedDataSource.dsId
      });
    }
  }, []);

  return (
    <Modal
      onSubmit={() => {
        // 쿼리 확인
        // 쿼리 확인 겸 필드 가져온 뒤 가공
        let tempFields = [
          {name: '측정값1', type: 'mea', dataType: 'number'},
          {name: '측정값2', type: 'mea', dataType: 'number'},
          {name: '측정값3', type: 'dim', dataType: 'varchar'},
          {name: '측정값4', type: 'dim', dataType: 'varchar'},
          {name: '측정값5', type: 'dim', dataType: 'varchar'}
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
          name: '데이터집합', type: 'FLD', uniqueName: '0', icon: folderImg
        });

        // state에 insert
        setDataset({
          ...dataset,
          datasetQuery: queryEditorRef.current.editor.getValue(),
          fields: tempFields
        });

        dispatch(insertDataset(dataset));
        // return true;
      }}
      width='70%'
      height='90%'
      modalTitle='데이터 집합 디자이너'
      {...props}
    >
      <RowWrapper>
        <ColumnWrapper>
          <ModalPanel
            title='데이터 원본 정보'
            width='300px'
            height='250px'
            padding='10'>
            <DataSourceInfoForm
              compact={true}
              selectedDataSource={selectedDataSource}
            />
          </ModalPanel>
          <ModalPanel
            title='데이터 항목'
            height='100%'
            width='300px'
            padding='10'>
            <TreeView></TreeView>
          </ModalPanel>
        </ColumnWrapper>
        <ColumnWrapper>
          <DatasetName
            name={dataset.datasetNm || ''}
            onChangedValue={(datasetNm) => {
              setDataset({...dataset, datasetNm});
            }}
          />
          <ModalPanel title='쿼리' height='100%' padding='10'>
            <QueryEditor editorRef={queryEditorRef}/>
          </ModalPanel>
          <ModalPanel title='매개변수' height='300px' padding='10'>
            <CommonDataGrid>
              <Column caption='매개변수 명'/>
              <Column caption='매개변수 Caption'/>
              <Column caption='데이터 유형'/>
              <Column caption='매개변수 유형'/>
              <Column caption='Visible'/>
              <Column caption='다중선택'/>
              <Column caption='순서'/>
              <Column caption='조건 명'/>
            </CommonDataGrid>
          </ModalPanel>
        </ColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
