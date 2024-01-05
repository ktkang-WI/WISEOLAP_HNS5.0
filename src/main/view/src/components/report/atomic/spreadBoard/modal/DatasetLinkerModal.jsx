import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column} from 'devextreme-react/data-grid';
import useSpread from 'hooks/useSpread';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {selectCurrentDesigner} from 'redux/selector/SpreadSelector';

const DatasetLinkerModal = ({...props}) => {
  const dispatch = useDispatch();
  const {bindData} = useSpread();
  const designer = useSelector(selectCurrentDesigner);
  const sheetNames = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });

  const testData = [{
    1: '2',
    3: '4'
  }];
  return (
    <Modal
      modalTitle={localizedString.datasetBinding}
      height='300px'
      width='700px'
      onSubmit={() => {
        dispatch(bindData(testData));
      }}
      {...props}
    >
      <CommonDataGrid
        dataSource={{}}
      >
        <Column caption='데이터 집합 명'
          dataSource={sheetNames}/>
        <Column dataField='dbNm' caption='Sheet 명'/>
        <Column dataField='dbmsType' caption='데이터 연동 위치'
          lookup={['test', 'test2']}/>
        <Column dataField='dbmsType' caption='헤더 표시 여부'/>
        <Column dataField='dbmsType' caption='테두리 표시 여부'/>
      </CommonDataGrid>
    </Modal>
  );
};

export default DatasetLinkerModal;
