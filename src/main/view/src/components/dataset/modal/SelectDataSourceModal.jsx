import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Column, Selection} from 'devextreme-react/data-grid';
import tempSelectDataSource from './tempSelectDataSource.json';
import DataSourceInfoForm from './SelectDataSourceModal/DataSourceInfoForm';
import {useState} from 'react';
import useModal from 'hooks/useModal';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import _ from 'lodash';

const SelectDataSourceModal = ({onSubmit, ...props}) => {
  const [selectedDataSource, setSelectedDataSource] = useState({});
  const {openModal} = useModal();

  return (
    <Modal
      onSubmit={()=> {
        if (!_.isEmpty(selectedDataSource)) {
          onSubmit(selectedDataSource);
        } else {
          openModal(Alert, {
            message: '으악'
          });

          return true;
        }
      }}
      width='70%'
      height='90%'
      modalTitle='데이터 원본 선택'
      {...props}
    >
      <CommonDataGrid
        width='40%'
        dataSource={tempSelectDataSource}
        onSelectionChanged={(e) => {
          setSelectedDataSource(e.selectedRowsData[0]);
        }}
      >
        <Selection mode='single'/>
        <Column caption='데이터 원본 명' dataField='DS_NM'/>
        <Column caption='DB 유형' dataField='DBMS_TYPE'/>
        <Column caption='서버 주소(명)' dataField='IP'/>
        <Column caption='사용자 데이터' dataField='USER_AREA_YN'/>
      </CommonDataGrid>
      <DataSourceInfoForm
        selectedDataSource={selectedDataSource}
        height='100%'
        width='40%'
      />
    </Modal>
  );
};

export default SelectDataSourceModal;
