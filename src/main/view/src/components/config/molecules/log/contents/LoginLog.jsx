import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import localizedString from 'config/localization';

const LoginLog = ({display, dataSource}) => {
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
          dataField='eventDt'
          caption={localizedString.log.date}
        />
        <Column
          dataField='eventTime'
          caption={localizedString.log.time}
        />
        <Column
          dataField='logType'
          caption={localizedString.log.logType}
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
          dataField='groupNm'
          caption={localizedString.log.groupNm}
        />
        <Column
          dataField='accessIp'
          caption='IP'
        />
        <Column
          dataField='modDt'
          caption={localizedString.log.modDt}
        />
      </DataGrid>
    </Wrapper>
  );
};

export default LoginLog;
