import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
// eslint-disable-next-line max-len
import ReportInfo from 'components/config/molecules/searchQuery/ReportInfo';
// eslint-disable-next-line max-len
import SearchQueryReportList from 'components/config/molecules/searchQuery/SearchQueryReportList';
import {setIconReportList} from 'components/report/util/ReportUtility';

import models from 'models';
import {useEffect, useState} from 'react';
import React from 'react';


const SearchQuery = () => {
  const [reportList, setReportList] = useState([]);
  const [itemData, setItemData] = useState({});

  useEffect(() => {
    models.Report.getListIncludeQuery().then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  return (
    <Wrapper display={'flex'}>
      <Wrapper width={'50%'}>
        <SearchQueryReportList
          reportList={reportList}
          setItemData={setItemData}
        />
      </Wrapper>
      <Wrapper width={'50%'}>
        <ReportInfo
          itemData={itemData}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(SearchQuery);
