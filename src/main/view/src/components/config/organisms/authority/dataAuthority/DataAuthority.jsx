import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import {useContext} from 'react';
import {AuthorityContext} from '../Authority';
import {Mode} from '../data/AuthorityData';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import AuthorityDataGrid
  from 'components/config/atoms/authority/AuthorityDataGrid';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';

const DataAuthority = ({data}) => {
  const getContext = useContext(AuthorityContext);

  console.log(getContext);
  console.log(data);
  // const [data, set] = getContext.state.data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper size="650px">
        {
          data.mode === Mode.GROUPDATA ?
          <GroupList/> :
          <UserList/>
        }
      </Wrapper>
      <Wrapper size="2" display='flex' direction='column'>
        <Wrapper>
          <DatasourceViewList/>
        </Wrapper>
        <Wrapper size="3" display='flex' direction='row'>
          <Wrapper>
            <AuthorityDataGrid/>
          </Wrapper>
          <Wrapper>
            <AuthorityDataGrid/>
          </Wrapper>
          <Wrapper>
            <AuthorityDataGrid/>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default DataAuthority;
