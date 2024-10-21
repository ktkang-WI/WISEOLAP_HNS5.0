import {CustomDataContext}
  from 'components/dataset/modal/CustomData/CustomDataModal';
import DataGrid, {Column, Editing} from 'devextreme-react/data-grid';
import {useContext} from 'react';
import {typeData} from '../../organism/CustomData/Data/customObjectList';
import styled from 'styled-components';
import localizedString from '../../../../../config/localization';
import customFieldImg from 'assets/image/icon/highlight/pivot_highlight_2.png';

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
  const [selectedRowKey, setSelectedRowKey] = getContext.state.selectedRowKey;
  const [dataSource] = getContext.state.customDataList;
  const [, setCustomData] = getContext.state.customData;

  const customUpdate = (data) => {
    setCustomData((prev) => {
      return {
        ...prev,
        fieldName: data.fieldName,
        fieldId: data.fieldId,
        expression: data.expression,
        type: data.type
      };
    });
  };

  const handleRowClick = (e) => {
    setSelectedRowKey(e.data.fieldId);
  };

  const handleCellClick = (e) => {
    if (!e.data) return;
    customUpdate(e.data);
  };

  const getCustomFieldImg = (e) => {
    if (e.data.fieldId === selectedRowKey) {
      // 선택된 로우인 경우 해당 이미지를 반환
      return true;
    } else {
      // 선택되지 않은 로우인 경우 다른 이미지를 반환하거나 비워둘 수 있습니다.
      return false;
    }
  };

  return (
    <>
      <DataGrid
        width={'100%'}
        height={'100%'}
        showBorders={true}
        hoverStateEnabled={true}
        dataSource={dataSource}
        onRowClick={handleRowClick}
        onCellClick={handleCellClick}
        allowColumnResizing={true}
      >
        <Editing
          mode="row"
          confirmDelete={false}
          allowDeleting={true}/>
        <Column
          dataField='fieldName'
          caption={localizedString.customData.list.fieldName}
          allowEditing={true}
          cellRender={(data) => {
            return (
              <Cell>
                {data.text}
                {getCustomFieldImg(data) ?
                <Img src={customFieldImg} alt="Custom Image" /> : null}
              </Cell>
            );
          }}/>
        <Column
          dataField='expression'
          caption={localizedString.customData.list.expression}
          allowEditing={false}
        />
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
