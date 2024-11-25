import {viewerMode}
  from 'components/config/organisms/portal/PortalConfigUtility';
import {DataGrid} from 'devextreme-react';
import {Column, Lookup} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';

const PortalTypeGrid = ({dxRef, ...props}) => {
  const {alert} = useModal();

  return (
    <DataGrid
      width={'100%'}
      height={'300px'}
      showBorders={true}
      ref={dxRef}
      style={{maxWidth: '700px'}}
      dataSource={[]}
      onRowInserting={(e) => {
        const newData = e.data;
        if (!newData.name || !newData.ordinal || !newData.auth) {
          e.cancel = true;
          alert('모든 필드를 입력해야 합니다.');
        }
      }}
      editing={{
        allowAdding: true,
        allowDeleting: true,
        allowUpdating: true,
        useIcons: true,
        confirmDelete: false,
        newRowPosition: 'last'
      }}
      {...props}
    >
      <Column dataField='auth' caption='뷰어 모드'>
        <Lookup
          dataSource={viewerMode}
          displayExpr={'caption'}
          valueExpr={'key'}/>
      </Column>
      <Column dataField='name' caption='필터 명'>
      </Column>
      <Column dataField='ordinal' caption='순서' dataType='number'>
      </Column>
    </DataGrid>
  );
};

export default PortalTypeGrid;
