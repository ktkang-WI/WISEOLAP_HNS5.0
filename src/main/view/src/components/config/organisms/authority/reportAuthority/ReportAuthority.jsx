import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useEffect} from 'react';
import {AuthorityContext, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import FolderTreeView
  from 'components/config/molecules/authority/FolderTreeView';

const ReportAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  const data = getContext.state.data;
  if (currentTab !== mainKey) return <></>;

  useEffect(() => {
    console.log(data);
    console.log(currentTab);
  }, [currentTab]);

  const handleRowClickGroup = (e) => {
    console.log(e.data);
  };
  const handleRowClickUser = (e) => {
    console.log(e.data);
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          currentTab === path.GROUP_REPORT &&
          <GroupList onRowClick={handleRowClickGroup}/>
        }
        {
          currentTab === path.USER_REPORT &&
          <UserList onRowClick={handleRowClickUser}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (currentTab === path.GROUP_REPORT ||
           currentTab === path.USER_REPORT) &&
          <FolderTreeView row={data}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ReportAuthority);

