import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Column, Selection} from 'devextreme-react/data-grid';
import {useEffect, useState} from 'react';
import useModal from 'hooks/useModal';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import _ from 'lodash';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import models from 'models';

const SelectDataSourceModal = ({onSubmit, ...props}) => {
  const [selectedDataSource, setSelectedDataSource] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const {openModal} = useModal();

  useEffect(() => {
    models.DataSource.getByIdAndDsType('admin', 'DS_SQL')
        .then((data) => {
          setDataSource(data);
        });
  }, []);

  return (
    <Modal
      onSubmit={()=> {
        if (!_.isEmpty(selectedDataSource)) {
          onSubmit(selectedDataSource);
        } else {
          openModal(Alert, {
            message: '데이터 원본을 선택하지 않았습니다.'
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
        dataSource={dataSource}
        onSelectionChanged={(e) => {
          setSelectedDataSource(e.selectedRowsData[0]);
        }}
      >
        <Selection mode='single'/>
        <Column caption='데이터 원본 명' dataField='dsNm'/>
        <Column caption='DB 유형' dataField='dbmsType'/>
        <Column caption='서버 주소(명)' dataField='ip'/>
        <Column caption='사용자 데이터' dataField='userAreaYn'/>
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
