import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import querySearchIcon from 'assets/image/icon/report/query_search.png';
import {getTheme} from 'config/theme';
import DateFilter from 'components/config/molecules/log/DateFilter';
import {useRef, useState} from 'react';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';
import ConfigTabs from '../common/ConfigTabs';
import {tabItems, searchingMapper} from './LogDataUtility';

const theme = getTheme();

const Log = () => {
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

  tabItems.forEach((item) => {
    item.props = {
      dataSource: dataSources[item.value] || []
    };
  });

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
      <ConfigTabs
        tabItems={tabItems}
        onChangedValue={setPage}
        page={page}
      >
      </ConfigTabs>
    </Wrapper>
  );
};

export default Log;
