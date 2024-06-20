import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import querySearchIcon from 'assets/image/icon/report/query_search.png';
import {getTheme} from 'config/theme';
import DateFilter from 'components/config/molecules/log/DateFilter';
import {useRef, useState} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TabMenu from 'components/config/molecules/common/TabMenu';
import LoginLog from 'components/config/molecules/log/contents/LoginLog';
import ReportLog from 'components/config/molecules/log/contents/ReportLog';
import DownloadLog from 'components/config/molecules/log/contents/DownloadLog';
import QueryLog from 'components/config/molecules/log/contents/QueryLog';
import models from 'models';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';

const theme = getTheme();

const Log = () => {
  const tabItems = [
    {
      'text': localizedString.log.loginLog,
      'value': 'login_log',
      'component': LoginLog
    },
    {
      'text': localizedString.log.reportLog,
      'value': 'report_log',
      'component': ReportLog
    },
    {
      'text': localizedString.log.exportLog,
      'value': 'export_log',
      'component': DownloadLog
    },
    {
      'text': localizedString.log.queryLog,
      'value': 'query_log',
      'component': QueryLog
    }
  ];

  const searchingMapper = {
    'login_log': models.Log.getLoginLog,
    'report_log': models.Log.getReportLog,
    'export_log': models.Log.getDownloadLog,
    'query_log': models.Log.getQueryLog
  };
  const defaultPrevDate = new Date();
  defaultPrevDate.setMonth(defaultPrevDate.getMonth() - 1);

  const dateRef = useRef([defaultPrevDate, new Date()]);
  const {alert} = useModal();
  const [page, setPage] = useState('login_log');
  const [dataSources, setDataSources] = useState(tabItems.
      reduce((acc, item) => {
        acc[item.value] = [];
        return acc;
      }, {}));

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}${month}${day}`;
  };

  const search = () => {
    const date = dateRef.current;
    searchingMapper[page](
        formatDate(date[0]), formatDate(date[1])).
        then(({data}) => {
          if (data.info == '200') {
            setDataSources({
              ...dataSources,
              [page]: data.data
            });
          } else {
            alert(localizedString.log.failMsg);
          }
        });
  };

  return (
    <Wrapper display='flex' direction='column'>
      <ConfigHeader style={{padding: '12px'}}>
        <DateFilter dateRef={dateRef}/>
        <div style={{
          float: 'right'
        }}>
          <CommonButton
            height='30px'
            width='83px'
            type='secondary'
            borderRadius={'4px'}
            font={theme.font.smallButton}
            onClick={search}
          >
            <img src={querySearchIcon}/>
            {localizedString.log.search}
          </CommonButton>
        </div>
      </ConfigHeader>
      <Wrapper
        display='flex'
        height='calc(100% - 60px)'
        direction='row'
        padding='10px 0px 0px 0px'
      >
        <TabMenu
          items={tabItems}
          onChangedValue={(value) => {
            setPage(value);
          }}
        />
        <Wrapper
          className='section'
          style={{
            borderRadius: '10px',
            border: 'solid 1px '+ theme.color.breakLine,
            background: theme.color.panelColor,
            overflow: 'hidden',
            padding: '15px'
          }}
        >
          {tabItems.map((item) => {
            const Component = item.component;

            return (<Component
              key={item.value}
              dataSource={dataSources[item.value]}
              display={item.value === page? 'block' : 'none'}
            >
            </Component>
            );
          })}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default Log;
