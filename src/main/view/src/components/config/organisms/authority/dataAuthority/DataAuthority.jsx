import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import UserGroupList from './UserGroupList';
import DatasourceViewList from './DatasourceViewList';
import {useContext} from 'react';

const DataAuthority = () => {
  const getContext = useContext(AuthorityContext);

  console.log(getContext);
  // const [data, set] = getContext.state.data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper size="650px">
        <UserGroupList/>
      </Wrapper>
      <Wrapper size="2" display='flex' direction='column'>
        <Wrapper>
          <DatasourceViewList/>
        </Wrapper>
        <Wrapper>

        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default DataAuthority;
