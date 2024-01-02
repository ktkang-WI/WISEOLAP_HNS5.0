import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column} from 'devextreme-react/data-grid';

const DatasetLinkerModal = ({...props}) => {
  return (
    <Modal
      modalTitle={localizedString.datasetBinding}
      height='300px'
      width='700px'
      onSubmit={() => {
        console.log('test');
      }}
      {...props}
    >
      <CommonDataGrid
        dataSource={{}}
      >
        <Column dataField='dsViewNm' caption='데이터 집합 명'/>
        <Column dataField='dbNm' caption='Sheet 명'/>
        <Column dataField='dbmsType' caption='데이터 연동 위치'/>
        <Column dataField='dbmsType' caption='헤더 표시 여부'/>
        <Column dataField='dbmsType' caption='테두리 표시 여부'/>
      </CommonDataGrid>
    </Modal>
  );
};

export default DatasetLinkerModal;
