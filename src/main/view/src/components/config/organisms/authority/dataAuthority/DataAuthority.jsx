import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useEffect} from 'react';
import {AuthorityContext, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';
import AuthorityDataCube
  from 'components/config/atoms/authority/AuthorityDataCube';
import AuthorityDataDimension
  from 'components/config/atoms/authority/AuthorityDataDimension';
import AuthorityDataMember
  from 'components/config/atoms/authority/AuthorityDataMember';

const DataAuthority = ({mainKey, ...props}) => {
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
    <Wrapper display='flex' direction='row' overflow='hidden'>
      <Wrapper padding='10px'>
        {
          currentTab === path.GROUP_DATA &&
          <GroupList onRowClick={handleRowClickGroup}/>
        }
        {
          currentTab === path.USER_DATA &&
          <UserList onRowClick={handleRowClickUser}/>
        }
      </Wrapper>
      <Wrapper display='flex' direction='column'>
        <Wrapper height="55%" padding='10px'>
          {
            (currentTab === path.GROUP_DATA || currentTab === path.USER_DATA) &&
            <DatasourceViewList />
          }
        </Wrapper>
        <Wrapper
          height="45%"
          size="3"
          display='flex'
          direction='row'
          padding='10px'
        >
          <Wrapper>
            <AuthorityDataCube/>
          </Wrapper>
          <Wrapper>
            <AuthorityDataDimension/>
          </Wrapper>
          <Wrapper>
            <AuthorityDataMember/>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DataAuthority);
