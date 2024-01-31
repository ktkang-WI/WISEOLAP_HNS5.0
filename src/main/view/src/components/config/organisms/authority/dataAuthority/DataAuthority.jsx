import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import {useEffect, useState} from 'react';
import {Mode} from '../data/AuthorityData';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';
import AuthorityDataDimension
  from 'components/config/atoms/authority/AuthorityDataDimension';
import AuthorityDataMember from
  'components/config/atoms/authority/AuthorityDataMember';
import AuthorityDataCube from
  'components/config/atoms/authority/AuthorityDataCube';

import models from 'models';

const DataAuthority = ({auth}) => {
  const [row, setRow] = useState({});
  const [dsView, setDsView] = useState({});
  const [dsViewCube, setDsViewCube] = useState([]);

  useEffect(() => {
    models.Authority.getDsViewCube()
        .then((response) => {
          setDsViewCube(response.data.data);
        });
  }, []);

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUPDATA ?
          <GroupList
            setRow={setRow}
          /> :
          <UserList
            setRow={setRow}
          />
        }
      </Wrapper>
      <Wrapper size="2" display='flex' direction='column'>
        <Wrapper height="55%" padding='10px'>
          <DatasourceViewList
            row={row}
            setDsView={setDsView}
          />
        </Wrapper>
        <Wrapper
          height="45%"
          size="3"
          display='flex'
          direction='row'
          padding='10px'
        >
          <Wrapper>
            <AuthorityDataCube
              dsView={dsView}
              dsViewCube={dsViewCube}
              row={row}
            />
          </Wrapper>
          <Wrapper>
            <AuthorityDataDimension
              dsView={dsView}
              dsViewCube={dsViewCube}
              row={row}
            />
          </Wrapper>
          <Wrapper>
            <AuthorityDataMember
              dsView={dsView}
              dsViewCube={dsViewCube}
              row={row}
            />
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default DataAuthority;
