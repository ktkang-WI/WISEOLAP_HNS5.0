import {viewerMode}
  from 'components/config/organisms/portal/PortalConfigUtility';
import {DataGrid} from 'devextreme-react';
import {
  Column, Editing, Form, Lookup, Popup, Item
} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';
import models from 'models';
import {useEffect, useState} from 'react';

const PortalCardGrid = ({dxRef, ...props}) => {
  const {alert} = useModal();
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    models.DataSource.getDs().then((res) => {
      if (res.status == 200) {
        setDataSource(res.data.data);
      }
    });
  }, []);

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
      {...props}
    >
      <Editing
        mode='popup'
        allowAdding={true}
        allowDeleting={true}
        allowUpdating={true}
        useIcons={true}
        confirmDelete={false}
        newRowPosition='last'
      >
        <Popup
          showTitle={false}
          width={700}
          height={600} />
        <Form>
          <Item
            itemType='group'
            colCount={1}
            colSpan={2}
          >
            <Item
              dataField='type'
              editorOptions={{width: '500px'}}
            />
            <Item
              dataField='dsId'
              editorOptions={{width: '500px'}}
            />
            <Item
              dataField='auth'
              editorOptions={{width: '500px'}}
            />
            <Item
              dataField='query'
              editorType='dxTextArea'
              editorOptions={{height: '250px', width: '500px'}}
            />
          </Item>
        </Form>
      </Editing>
      <Column dataField='type' caption='구분'>
      </Column>
      <Column dataField='auth' caption='뷰어 모드'>
        <Lookup
          dataSource={viewerMode}
          displayExpr={'caption'}
          valueExpr={'key'}/>
      </Column>
      <Column dataField='dsId' caption='데이터 원본'>
        <Lookup
          dataSource={dataSource}
          displayExpr={'dsNm'}
          valueExpr={'dsId'}/>
      </Column>
      <Column dataField='query' caption='쿼리'>
      </Column>
    </DataGrid>
  );
};

export default PortalCardGrid;
