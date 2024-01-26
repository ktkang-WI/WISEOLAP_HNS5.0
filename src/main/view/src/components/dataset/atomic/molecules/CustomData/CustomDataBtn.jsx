import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import {useContext} from 'react';
import {ButtonGroup} from 'devextreme-react';


const CustomDataBtn = () => {
  const getContext = useContext(CustomDataContext);
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const fontStyles = [{
    icon: 'plus',
    hint: '추가',
    style: 'bold',
    id: 'plus'
  }];
  const ActionPage = {
    plus: () => moveToCalculator()
  };

  const moveToCalculator = () =>{
    setMoveToPage(!moveToPage);
  };

  // 사용자 정의 데이터 항목 추가.
  const handleItemClick = (event) => {
    const Action = event.itemData.id;
    ActionPage[Action] ?
    ActionPage[Action]() : console.error('clickedItem is null');
  };

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
