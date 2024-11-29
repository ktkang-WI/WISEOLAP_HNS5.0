import {viewerMode}
  from 'components/config/organisms/portal/PortalConfigUtility';
import {DataGrid} from 'devextreme-react';
import {Column, Lookup} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';
import models from 'models';
import {useEffect, useState} from 'react';
// eslint-disable-next-line max-len
import {dataPrepro, Mode} from 'components/config/organisms/reportFolderManagement/data/ReportFolderManagementData';
import SearchReportCell from 'components/config/atoms/portal/SearchReportCell';

const PortalReportGrid = ({dxRef, ...props}) => {
  const {alert} = useModal();
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    models.ReportFolderManagement.getFolderReports().then((res) => {
      if (res.status == 200) {
        const newData = dataPrepro({data: res.data.data,
          mode: Mode.REPORT_MANAGEMENT});
        setReportList(newData);
      }
    }).catch((e) => {
      console.error(e);
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
      paging={{
        enabled: false
      }}
      onRowInserting={(e) => {
        const newData = e.data;
        if (!newData.reportId || !newData.ordinal ||
          !newData.auth || !newData.type) {
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
      <Column dataField='type' caption='구분'>
      </Column>
      <Column
        dataField='reportId'
        caption='보고서'
        editCellComponent={(cellInfo) => {
          const onSubmit = (itemData) => {
            cellInfo.data.setValue(itemData.reportId, itemData.reportNm);
          };
          return <SearchReportCell
            onSubmit={onSubmit}
            reportList={reportList}
            defaultValue={cellInfo.data.text}
          />;
        }}>
        <Lookup
          dataSource={reportList}
          displayExpr={'reportNm'}
          valueExpr={'reportId'}/>
      </Column>
      <Column dataField='ordinal' caption='순서' dataType='number'>
      </Column>
    </DataGrid>
  );
};

export default PortalReportGrid;
