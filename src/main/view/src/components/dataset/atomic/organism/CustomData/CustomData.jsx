import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomDataList from '../../molecules/CustomData/CustomDataList';
import CustomDataBtn from '../../molecules/CustomData/CustomDataBtn';

// 사용자 정의 데이터 필드값 목록
const CustomData = ({...props}) => {
  return (
    <Wrapper display='flex' direction='column'>
      <Wrapper display='flex' direction='row' size='40px'>
        <CustomDataBtn />
      </Wrapper>
      <Wrapper>
        <CustomDataList />
      </Wrapper>
    </Wrapper>
  );
};

export default CustomData;
