import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useEffect} from 'react';
import {AuthorityContext, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasetTreeView
  from 'components/config/molecules/authority/DatasetTreeView';

const DatasetAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  useEffect(() => {
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
          currentTab === path.GROUP_DATASET &&
          <GroupList onRowClick={handleRowClickGroup}/>
        }
        {
          currentTab === path.USER_DATASET &&
          <UserList onRowClick={handleRowClickUser}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (currentTab=== path.GROUP_DATASET ||
           currentTab === path.USER_DATASET) && <DatasetTreeView />
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DatasetAuthority);
