import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import FolderTreeView
  from 'components/config/molecules/authority/FolderTreeView';

const ReportAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_REPORT) {
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
      <Wrapper padding='10px' size='4'>
        {
          currentTab === path.GROUP_REPORT &&
          <GroupList onRowClick={handleRowClick} dependency={dependency}/>
        }
        {
          currentTab === path.USER_REPORT &&
          <UserList onRowClick={handleRowClick} dependency={dependency}/>
        }
      </Wrapper>
      <Wrapper padding='10px' size='6'>
        {
          (currentTab === path.GROUP_REPORT ||
           currentTab === path.USER_REPORT) &&
          <FolderTreeView
            mainKey={mainKey}
            dependency={dependency}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ReportAuthority);

