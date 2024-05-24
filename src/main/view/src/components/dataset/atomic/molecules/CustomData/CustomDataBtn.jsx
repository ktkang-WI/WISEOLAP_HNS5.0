import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import {useContext} from 'react';
import {ButtonGroup} from 'devextreme-react';


const CustomDataBtn = () => {
  const getContext = useContext(CustomDataContext);
  const [customDataList] = getContext.state.customDataList;
  const [, setCustomData] = getContext.state.customData;
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const [createCustom, setCreateCustom] = getContext.state.createCustom;
  const [updateCustom, setUpdateCustom] = getContext.state.updateCustom;
  const [, setSelectedRowKey] = getContext.state.selectedRowKey;

  const fontStyles = [{
    icon: 'plus',
    hint: '추가',
    style: 'bold',
    id: 'plus'
  }, {
    icon: 'rename',
    hint: '업데이트',
    style: 'bold',
    id: 'rename'
  }];

  const customDataInitial = () => {
    return {
      fieldId: 1,
      fieldName: '',
      expression: '',
      type: 'numeric'
    };
  };

  const ActionPage = {
    plus: () => handleCreateCustom(),
    rename: () => handleUpdateCustom()
  };

  const handleCreateCustom = () => {
    const lastFieldId = customDataList.length === 0 ?
    1 : customDataList[customDataList.length - 1].fieldId + 1;
    // 사용자 정의 데이터 값 업데이트
    setSelectedRowKey(null);
    setCustomData(() => {
      return {
        customDataInitial,
        fieldId: lastFieldId
      };
    });
    setCreateCustom(!createCustom);
    moveToCalculator();
  };

  const handleUpdateCustom = () => {
    setUpdateCustom(!updateCustom);
    moveToCalculator();
  };

  const moveToCalculator = () => {
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
