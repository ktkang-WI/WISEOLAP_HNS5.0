import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TopBtns from '../../molecules/CustomData/Calc/TopBtns';
import CalcDefineArea from
  '../../molecules/CustomData/Calc/CalcDefineArea';
import CalcObjectList
  from '../../molecules/CustomData/Calc/CalcObjectList';

/* 사용자 정의 데이터 계산식 매개변수,열,함수 등등을 이용하여 계산식을 정의합니다.
@Autor : KIM JAE HYEON
@Date : 20231214 */
const CustomDataCalc = ({...props}) => {
  return (
    <>
      <Wrapper size="50%">
        <Wrapper display='flex' direction='column'>
          <Wrapper size="10%" display='flex' direction='row'>
            <TopBtns />
          </Wrapper>
          <Wrapper size="2px"/>
          <Wrapper>
            <CalcDefineArea />
          </Wrapper>
        </Wrapper>
      </Wrapper>
      <Wrapper size="50%" display='flex' direction='row'>
        <CalcObjectList />
      </Wrapper>
    </>
  );
};

export default CustomDataCalc;
