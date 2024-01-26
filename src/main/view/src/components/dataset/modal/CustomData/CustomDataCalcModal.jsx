import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {
  createContext,
  useState
} from 'react';
import CustomDataCalc
  from 'components/dataset/atomic/organism/CustomData/CustomDataCalc';
import useModal from 'hooks/useModal';
import localizedString from '../../../../config/localization';


// 사용자 정의 데이터 계산식 화면
export const CustomDataCalContext = createContext();

const CustomDataCalcModal = ({...props}) => {
  // Modal
  const {alert} = useModal();

  // CustomData Toss
  const getCustomData = props.customData;

  // UseState
  const [checkForSaving, setCheckForSaving] = useState({
    inspection: false,
    type: (getCustomData.type) ? true : false
  });
  const [customData, setCustomData] = useState({
    fieldId: getCustomData.fieldId,
    fieldName: getCustomData.fieldName,
    expression: getCustomData.expression,
    type: getCustomData.type
  });

  // Context
  const context = {
    state: {
      customData: [
        customData,
        setCustomData
      ],
      checkForSaving: [
        checkForSaving,
        setCheckForSaving
      ],
      allFields: [
        props.allFields,
        null
      ]
    }
  };

  // TODO: 임시기능요 NULL 체크
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
        customData.expression,
        customData.type);
    if (isOk === false) {
      alert(localizedString.alertInfo.customDataCalc.empty);
      return isOk;
    }

    if (checkForSaving.inspection === false) {
      alert(localizedString.alertInfo.customDataCalc.Inspection);
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
        modalTitle={localizedString.customDataCalc.title}
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
