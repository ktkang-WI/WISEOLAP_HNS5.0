import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {Column} from 'devextreme-react/data-grid';
import useSpread from 'hooks/useSpread';
import {useSelector} from 'react-redux';
import {selectCurrentDesigner} from 'redux/selector/SpreadSelector';

const DatasetLinkerModal = ({...props}) => {
  const {bindData} = useSpread();
  const designer = useSelector(selectCurrentDesigner);
  const sheetNames = designer.getWorkbook().sheets.map((sheet) => {
    return sheet.name();
  });

  const datas = [
    {
      userId: 1,
      firstName: 'AAAAA',
      lastName: 'as23',
      phoneNumber: '123456',
      emailAddress: 'AAAAA@test.com',
      homepage: 'https://amogg.tistory.com/1'
    },
    {
      userId: 2,
      firstName: 'BBBB',
      lastName: false,
      phoneNumber: '123456',
      homepage: 'https://amogg.tistory.com/2'
    },
    {
      userId: 3,
      firstName: undefined,
      lastName: '2dhbs',
      phoneNumber: '33333333',
      homepage: 'https://amogg.tistory.com/3'
    },
    {
      userId: 4,
      firstName: 'DDDDD',
      lastName: 'bacasd',
      phoneNumber: '222222222',
      homepage: 'https://amogg.tistory.com/4'
    },
    {
      userId: 5,
      firstName: 'EEEEE',
      lastName: 'asdfasdf',
      phoneNumber: '111111111',
      homepage: 'https://amogg.tistory.com/5'
    }
  ];

  const dataset = {};
  return (
    <Modal
      modalTitle={localizedString.datasetBinding}
      height='300px'
      width='700px'
      onSubmit={() => {
        bindData({dataset: dataset, datas: datas});
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
