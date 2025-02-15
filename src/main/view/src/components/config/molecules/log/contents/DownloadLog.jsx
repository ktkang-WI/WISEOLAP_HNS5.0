import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const DownloadLog = ({display, dataSource}) => {
  return (
    <Wrapper
      style={{display}}
    >
      <DataGrid
        width={'100%'}
        height={'100%'}
        showBorders={true}
        dataSource={dataSource}
        allowColumnResizing={true}
      >
        <Column
          dataField='eventDt'
          sortOrder='desc'
          caption={localizedString.log.date}
        />
        <Column
          dataField='eventTime'
          sortOrder='desc'
          caption={localizedString.log.time}
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
          dataField='ctrlId'
          caption={localizedString.log.ctrlId}
        />
        <Column
          dataField='ctrlCaption'
          caption={localizedString.log.ctrlCaption}
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
          dataField='accessIp'
          caption='IP'
        />
      </DataGrid>
    </Wrapper>
  );
};

export default DownloadLog;
