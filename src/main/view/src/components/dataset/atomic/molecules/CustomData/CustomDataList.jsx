import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import {ButtonGroup} from 'devextreme-react';
import DataGrid, {Column, Editing} from 'devextreme-react/data-grid';
import {useContext} from 'react';

/* 사용자 정의 데이터 필드값 목록
@Autor : KIM JAE HYEON
@Date : 20231214 */
const CustomDataList = ({...props}) => {
  // #################################### 변수 선언 시작
  const getContext = useContext(CustomDataContext);
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const [dataSource] = getContext.state.customDataList;
  const [, setCustomData] = getContext.state.customData;

  const fontStyles = [{
    icon: 'plus',
    hint: '추가',
    style: 'bold'
  }];
  // #################################### 변수 선언 종료
  // #################################### 함수 시작
  // 계산식 모달 오픈
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
  // 계산식 수정 CELL 클릭시 계산식화면 이동
  const handleRowDoubleClick = (e) => {
    if (e.rowIndex === -1) return;
    if (e.column.dataField === 'calculation') {
      // 선택된 row CustomData 업데이트
      setCustomData((prev)=>{
        return {
          ...prev,
          fieldName: e.data.fieldName,
          fieldId: e.data.fieldId,
          calculation: e.data.calculation,
          type: e.data.type
        };
      });
      handleCalculator();
    };
  };
  // #################################### 함수 종료
  return (
    <Wrapper display='flex' direction='column'>
      <Wrapper display='flex' direction='row' size='40px'>
        <ButtonGroup
          items={fontStyles}
          keyExpr="style"
          onItemClick={handleItemClick}
          selectionMode='none'
        />
      </Wrapper>
      <Wrapper>
        <DataGrid
          width={'100%'}
          height={'100%'}
          showBorders={true}
          hoverStateEnabled={true}
          dataSource={dataSource}
          onCellDblClick={(e) => handleRowDoubleClick(e)}
        >
          <Editing
            mode="row"
            allowUpdating={true}
            allowDeleting={true}/>
          <Column dataField='fieldName' caption='필드명' allowEditing={true}/>
          <Column dataField='calculation' caption='계산식' allowEditing={false}
            cellRender={(data) => {
              return (
                <div className="custom-cursor-column">
                  {data.text}
                </div>
              );
            }}/>
          <Column dataField='type' caption='데이터형식' allowEditing={false}/>
        </DataGrid>
      </Wrapper>
    </Wrapper>
  );
};

export default CustomDataList;
