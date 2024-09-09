import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
// eslint-disable-next-line max-len
import ReportInfo from 'components/config/molecules/searchQuery/ReportInfo';
// eslint-disable-next-line max-len
import SearchQueryReportList from 'components/config/molecules/searchQuery/SearchQueryReportList';
import {setIconReportList} from 'components/report/util/ReportUtility';

import models from 'models';
import {useEffect, useState} from 'react';
import React from 'react';

import {getTheme} from 'config/theme';

const theme = getTheme();

const SearchQuery = () => {
  const [reportList, setReportList] = useState([]);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    models.Report.getListIncludeQuery().then(({data}) => {
      setIconReportList(data.publicReport);
      setReportList(data);
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <Wrapper
      display={'flex'}
      style={{
        borderRadius: '10px',
        border: 'solid 1px ' + theme.color.breakLine,
        background: theme.color.panelColor,
        overflow: 'hidden',
        padding: '15px'
      }}
    >
      <Wrapper
        width={'50%'}
      >
        <SearchQueryReportList
          reportList={reportList}
          setItemData={setItemData}
        />
      </Wrapper>
      <Wrapper
        padding='10px'
        width={'50%'}
      >
        <ReportInfo
          itemData={itemData}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(SearchQuery);
