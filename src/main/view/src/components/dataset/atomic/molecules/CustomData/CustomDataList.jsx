import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import DataGrid, {Column, Editing} from 'devextreme-react/data-grid';
import {useContext} from 'react';
import {typeData} from '../../organism/CustomData/Data/customObjectList';


const CustomDataList = ({...props}) => {
  // #################################### 변수 선언 시작
  const getContext = useContext(CustomDataContext);
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const [dataSource] = getContext.state.customDataList;
  const [, setCustomData] = getContext.state.customData;
  // #################################### 변수 선언 종료
  const handleCalculator = () =>{
    setMoveToPage(!moveToPage);
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
  // #################################### 변수 선언 종료
  return (
    <>
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
        <Column dataField='type' caption='데이터형식' lookup={{
          dataSource: typeData,
          valueExpr: 'id',
          displayExpr: 'text'
        }}/>
      </DataGrid>
    </>
  );
};
export default CustomDataList;
