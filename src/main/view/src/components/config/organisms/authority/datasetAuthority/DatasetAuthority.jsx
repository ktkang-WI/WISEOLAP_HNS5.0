import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasetTreeView
  from 'components/config/molecules/authority/DatasetTreeView';

const DatasetAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_DATASET) {
      selected[mode.GROUP].prev = selected[mode.GROUP].next;
      selected[mode.GROUP].next = e.data;
    } else {
      selected[mode.USER].prev = selected[mode.USER].next;
      selected[mode.USER].next = e.data;
    }
    setDependency((prev) => !prev);
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          currentTab === path.GROUP_DATASET &&
          <GroupList onRowClick={handleRowClick}/>
        }
        {
          currentTab === path.USER_DATASET &&
          <UserList onRowClick={handleRowClick}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (currentTab=== path.GROUP_DATASET ||
           currentTab === path.USER_DATASET) &&
          <DatasetTreeView
            mainKey={mainKey}
            dependency={dependency}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DatasetAuthority);
