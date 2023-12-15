import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import {useContext} from 'react';
import {ButtonGroup} from 'devextreme-react';


const CustomDataBtn = ({...props}) => {
  // #################################### 변수 선언 시작
  const getContext = useContext(CustomDataContext);
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const fontStyles = [{
    icon: 'plus',
    hint: '추가',
    style: 'bold'
  }];
  // #################################### 변수 선언 종료
  // #################################### 함수 시작
  const handleCalculator = () =>{
    setMoveToPage(!moveToPage);
  };
  // 사용자 정의 데이터 항목 추가.
  // TODO: 추가 하드코딩값 상의후 변경 예정
  const handleItemClick = (event) => {
    const clickedItem = event.itemData.hint;
    if ( clickedItem === '추가') {
      handleCalculator();
    };
  };
  // #################################### 변수 선언 종료
  return (
    <>
      <ButtonGroup
        items={fontStyles}
        keyExpr="style"
        onItemClick={handleItemClick}
        selectionMode='none'
      />
    </>
  );
};
export default CustomDataBtn;
