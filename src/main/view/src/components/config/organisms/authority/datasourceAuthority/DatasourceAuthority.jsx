import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasourceList from
  'components/config/molecules/authority/DatasourceList';

const DatasourceAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_DATASOURCE) {
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
          currentTab === path.GROUP_DATASOURCE &&
          <GroupList onRowClick={handleRowClick} dependency={dependency}/>
        }
        {
          currentTab === path.USER_DATASOURCE &&
          <UserList onRowClick={handleRowClick} dependency={dependency}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (currentTab === path.GROUP_DATASOURCE ||
           currentTab === path.USER_DATASOURCE) &&
          <DatasourceList
            mainKey={mainKey}
            dependency={dependency}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DatasourceAuthority);
