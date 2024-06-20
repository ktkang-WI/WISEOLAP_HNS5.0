import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';


const ReportLog = ({display, dataSource}) => {
  return (
    <Wrapper
      style={{display}}
    >
      <DataGrid
        showBorders={true}
        width={'100%'}
        height={'100%'}
        dataSource={dataSource}
      >
        <Column
          dataField='reportId'
          caption={localizedString.log.reportId}
        />
        <Column
          dataField='reportNm'
          caption={localizedString.log.reportNm}
        />
        <Column
          dataField='reportType'
          caption={localizedString.log.reportType}
        />
        <Column
          dataField='startTime'
          caption={localizedString.log.startTime}
        />
        <Column
          dataField='endTime'
          caption={localizedString.log.endTime}
        />
        <Column
          dataField='eventTime'
          caption={localizedString.log.eventTime}
        />
        <Column
          dataField='userId'
          caption={localizedString.log.userId}
        />
        <Column
          dataField='userNm'
          caption={localizedString.log.userNm}
        />
        <Column
          dataField='grpNm'
          caption={localizedString.log.grpNm}
        />
        <Column
          dataField='ip'
          caption='IP'
        />
      </DataGrid>
    </Wrapper>
  );
};

export default ReportLog;
