import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';
import {useCallback} from 'react';


const ReportLog = ({display, dataSource}) => {
  const getEventTime = useCallback((data) => {
    const {startDt, endDt} = data;

    const startDate = new Date(startDt);
    const endDate = new Date(endDt);

    const eventDtInMilliseconds = endDate - startDate;

    const eventDtInSeconds = Math.floor(eventDtInMilliseconds / 1000);

    // 초를 시, 분, 초로 나누기
    const hours = Math.floor(eventDtInSeconds / 3600);
    const minutes = Math.floor((eventDtInSeconds % 3600) / 60);
    const seconds = eventDtInSeconds % 60;

    const formatNumber = (num) => num.toString().padStart(2, '0');

    const formattedTime =
        `${formatNumber(hours)}:${formatNumber(minutes)}` +
        `:${formatNumber(seconds)}`;
    return formattedTime;
  }, [dataSource]);

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
          dataField='startDt'
          sortOrder='desc'
          caption={localizedString.log.startTime}
        />
        <Column
          dataField='endDt'
          caption={localizedString.log.endTime}
        />
        <Column
          allowSorting={true}
          caption={localizedString.log.eventTime}
          calculateCellValue={getEventTime}
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

export default ReportLog;
