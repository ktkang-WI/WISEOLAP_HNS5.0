import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomDataCalcHandler
  from 'components/dataset/atomic/molecules/CustomData/CustomDataCalcHandler';
import {
  createContext,
  useState
} from 'react';


/* 사용자 정의 데이터 계산식 화면
@Autor : KIM JAE HYEON
@Date : 20231214 */
export const CustomDataCalContext = createContext();

const CustomDataCalcModal = ({...props}) => {
  // #################################### 변수 선언 시작
  const getCustomData = props.customData;
  const [customData, setCustomData] = useState({
    fieldId: getCustomData.fieldId,
    fieldName: getCustomData.fieldName,
    calculation: getCustomData.calculation,
    type: getCustomData.type
  });
  const context = {
    state: {
      customData: [
        customData,
        setCustomData
      ]
    }
  };
  // #################################### 변수 선언 종료

  return (
    <CustomDataCalContext.Provider
      value={context}
    >
      <Modal
        onSubmit={()=>{
          props.onSubmit(customData);
        }}
        onClose={()=>{
          return props.onClose();
        }}
        height='650px'
        width='1050px'
        modalTitle='계산식 편집'
      >
        <Wrapper display='flex' direction='row'>
          <Wrapper size="100%" display='flex' direction='column'>
            {/* 매개변수,상수,함수,열 를 이용하여 사용자 정의 데이터를 정의합니다.*/}
            <CustomDataCalcHandler/>
          </Wrapper>
        </Wrapper>
      </Modal>
    </CustomDataCalContext.Provider>
  );
};

export default CustomDataCalcModal;
