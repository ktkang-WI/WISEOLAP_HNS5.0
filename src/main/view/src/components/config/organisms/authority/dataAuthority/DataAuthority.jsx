import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';
import AuthorityDataCube
  from 'components/config/atoms/authority/AuthorityDataCube';
import AuthorityDataDimension
  from 'components/config/atoms/authority/AuthorityDataDimension';

const DataAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);
  const [dsViewId, setDsViewId] = useState();

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_DATA) {
      selected[mode.GROUP].prev = selected[mode.GROUP].next;
      selected[mode.GROUP].next = e.data;
    } else {
      selected[mode.USER].prev = selected[mode.USER].next;
      selected[mode.USER].next = e.data;
    }
    setDependency((prev) => !prev);
    setDsViewId(0);
  };

  return (
    <Wrapper display='flex' direction='row' overflow='hidden'>
      <Wrapper padding='10px'>
        {
          currentTab === path.GROUP_DATA &&
          <GroupList onRowClick={handleRowClick}/>
        }
        {
          currentTab === path.USER_DATA &&
          <UserList onRowClick={handleRowClick}/>
        }
      </Wrapper>
      <Wrapper display='flex' direction='column'>
        <Wrapper height="55%" padding='10px'>
          {
            (currentTab === path.GROUP_DATA || currentTab === path.USER_DATA) &&
            <DatasourceViewList
              mainKey={mainKey}
              dependency={dependency}
              setDsViewId={setDsViewId}/>
          }
        </Wrapper>
        <Wrapper
          height="45%"
          size="3"
          display='flex'
          direction='row'
          padding='10px'
        >
          <Wrapper
            size="1"
          >
            <AuthorityDataCube
              mainKey={mainKey}
              dependency={dependency}
              dsViewId={dsViewId}
              setDependency={setDependency}/>
          </Wrapper>
          <Wrapper
            size="1"
          >
            <AuthorityDataDimension
              mainKey={mainKey}
              dependency={dependency}
              dsViewId={dsViewId}/>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DataAuthority);
