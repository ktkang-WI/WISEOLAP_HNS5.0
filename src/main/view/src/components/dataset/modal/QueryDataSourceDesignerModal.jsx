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
import {useRef} from 'react';

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, query='', ...props
}) => {
  const dispatch = useDispatch();
  const {insertDataset} = ReportSlice.actions;
  const queryEditorRef = useRef();
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
        const dataset = {
          datasetNm: '데이터집합',
          datasetQuery: queryEditorRef.current.editor.getValue(),
          datsetType: 'DS_SQL',
          datasrcId: 5145,
          fields: tempFields
        };

        dispatch(insertDataset(dataset));
        // return true;
      }}
      width='70%'
      height='90%'
      modalTitle='데이터 집합 디자이너'
      {...props}
    >
      <DataSourceInfoForm
        compact={true}
        selectedDataSource={selectedDataSource}
      />
      <QueryEditor editorRef={queryEditorRef}/>
      <TreeView></TreeView>
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
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
