import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {
  createContext,
  useState
} from 'react';
import CustomDataCalc
  from 'components/dataset/atomic/organism/CustomData/CustomDataCalc';
import useModal from 'hooks/useModal';


// 사용자 정의 데이터 계산식 화면
export const CustomDataCalContext = createContext();

const CustomDataCalcModal = ({...props}) => {
  const {alert} = useModal();
  const getCustomData = props.customData;
  const [checkForSaving, setCheckForSaving] = useState({
    inspection: false,
    type: false
  });
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
      ],
      checkForSaving: [
        checkForSaving,
        setCheckForSaving
      ]
    }
  };

  // TODO: NULL 공용 함수로 이동유무 결정
  const nullCheck = (...args) => {
    let isOk = true;
    args.forEach((item) => {
      if (!item) {
        isOk = false;
      }
    });
    return isOk;
  };
  const handleException = () => {
    let isOk = true;
    // 사용자 정의 데이터 NULL 체크
    isOk = nullCheck(
        customData.fieldName,
        customData.calculation,
        customData.type);
    if (isOk === false) {
      alert('필드명,계산식,타입이 빈값이 있습니다.');
      return isOk;
    }
    if (checkForSaving.inspection === false) {
      alert('계산식이 검증되지 않았습니다.');
      isOk = false;
    }
    return isOk;
  };
  const handleConfirm = () => {
    let isOk = false;
    if (!handleException()) {
      isOk = true;
    };
    return isOk;
  };
  // #################################### 함수 시작
  return (
    <CustomDataCalContext.Provider
      value={context}
    >
      <Modal
        onSubmit={()=>{
          if (handleConfirm()) {
            return true;
          } else {
            props.onSubmit(customData);
          }
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
            <CustomDataCalc/>
          </Wrapper>
        </Wrapper>
      </Modal>
    </CustomDataCalContext.Provider>
  );
};

export default CustomDataCalcModal;
