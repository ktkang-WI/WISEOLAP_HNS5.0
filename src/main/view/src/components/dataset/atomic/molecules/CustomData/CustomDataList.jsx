import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import DataGrid, {Column, Editing} from 'devextreme-react/data-grid';
import {useContext} from 'react';
import {typeData} from '../../organism/CustomData/Data/customObjectList';
import styled from 'styled-components';
import localizedString from '../../../../../config/localization';
import customFieldImg from 'assets/image/icon/button/inputTxt.png';

const Img = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  -webkit-user-select: none !important; 
  -moz-user-select: -moz-none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const Cell = styled.div`
  display: flex;
  justify-content: space-between;
`;


const CustomDataList = () => {
  const getContext = useContext(CustomDataContext);
  const [moveToPage, setMoveToPage] = getContext.state.moveToPage;
  const [dataSource] = getContext.state.customDataList;
  const [, setCustomData] = getContext.state.customData;

  const handleCalculator = () =>{
    setMoveToPage(!moveToPage);
  };

  // 계산식 수정 CELL 클릭시 계산식화면 이동
  const handleRowDoubleClick = (e) => {
    if (e.rowIndex === -1) return;
    if (e.column.caption === localizedString.customData.list.expression) {
      // 선택된 row CustomData 업데이트
      setCustomData((prev) => {
        return {
          ...prev,
          fieldName: e.data.fieldName,
          fieldId: e.data.fieldId,
          expression: e.data.expression,
          type: e.data.type
        };
      });
      handleCalculator();
    };
  };

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
          confirmDelete={false}
          allowDeleting={true}/>
        <Column
          dataField='fieldName'
          caption={localizedString.customData.list.fieldName}
          allowEditing={true}/>
        <Column
          dataField='expression'
          caption={localizedString.customData.list.expression}
          allowEditing={false}
          cellRender={(data) => {
            return (
              <Cell>
                {data.text}
                <Img src={customFieldImg}/>
              </Cell>
            );
          }}/>
        <Column
          dataField='type'
          caption={localizedString.customData.list.type}
          lookup={{
            dataSource: typeData,
            valueExpr: 'id',
            displayExpr: 'text'
          }}
        />
      </DataGrid>
    </>
  );
};
export default CustomDataList;
