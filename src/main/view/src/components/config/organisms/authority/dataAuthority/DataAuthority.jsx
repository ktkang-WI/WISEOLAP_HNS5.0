import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import {createContext, useState} from 'react';
import {Mode} from '../data/AuthorityData';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import AuthorityDataGrid
  from 'components/config/atoms/authority/AuthorityDataGrid';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';

export const AuthorityDataContext = createContext();

const DataAuthority = ({data}) => {
  const [row, setRow] = useState({});

  const context = {
    state: {
      row: [row, setRow]
    }
  };

  return (
    <AuthorityDataContext.Provider
      value={context}>
      <Wrapper display='flex' direction='row'>
        <Wrapper size="650px">
          {
            data.mode === Mode.GROUPDATA ?
            <GroupList/> :
            <UserList/>
          }
        </Wrapper>
        <Wrapper size="2" display='flex' direction='column'>
          <Wrapper height="50%">
            <DatasourceViewList/>
          </Wrapper>
          <Wrapper height="50%" size="3" display='flex' direction='row'>
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
    </AuthorityDataContext.Provider>
  );
};

export default DataAuthority;
