import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import {useRef} from 'react';

const DatasourceViewList = () => {
  const ref = useRef();
  const groupsFormat = {};
  const handleRowClick = () => {
    return;
  };

  return (
    <DataGrid
      dataSource={groupsFormat}
      showBorders={true}
      onRowClick={handleRowClick}
      ref={ref}
    >
      <Selection mode="single" />
      <Column
        dataField="dsViewNm"
        caption="데이터 원본 뷰 명"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="dsNm"
        caption="데이터 원본 명"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="dbType"
        caption="DB 유형"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="owner"
        caption="소유자"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="ip"
        caption="서버 주소(명)"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="dbNm"
        caption="DB 명"
        dataType="varchar"
        format="currency"
      />
    </DataGrid>
  );
};

export default DatasourceViewList;
