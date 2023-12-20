import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from '../../../../config/localization';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomData
  from 'components/dataset/atomic/organism/CustomData/CustomData';
import {createContext, useEffect, useState} from 'react';
import CustomDataCalcModal from './CustomDataCalcModal';


// TODO: 리덕스 데이터 가져오기 구현
export const CustomDataContext = createContext();

const CustomDataModal = ({...props}) =>{
  const customDataInitial = () => {
    return {
      fieldId: 1,
      fieldName: '',
      expression: '',
      type: ''
    };
  };
  const {openModal, alert} = useModal();
  const [customDataList, setCustomDataList] = useState([]);
  const [moveToPage, setMoveToPage] = useState(false);
  const [customData, setCustomData] = useState(customDataInitial);
  const context = {
    state: {
      moveToPage: [
        moveToPage,
        setMoveToPage
      ],
      customData: [
        customData,
        setCustomData
      ],
      customDataList: [
        customDataList,
        setCustomDataList
      ]
    }
  };

  useEffect(()=>{
    if (moveToPage) handleModal();
    return () => {
      setMoveToPage(false);
    };
  }, [moveToPage]);

  // TODO: NULL 공용 함수로 이동유무 결정
  const nullCheck = (...args) => {
    let isok = true;
    args.forEach((item)=>{
      (!item) ? isok = false: isok = true;
    });
    return isok;
  };
  // 계산식 이동
  const handleModal = () => {
    if ( moveToPage ) {
      openModal(CustomDataCalcModal, {
        customData,
        onSubmit: (returedCustomData) => {
          // 사용자 정의 데이터 추가 OR 업데이트
          customDataService(returedCustomData);
        }
      });
      setMoveToPage(!moveToPage);
    }
  };
  // 추가 , 업데이트 로직
  const customDataService = (customData) => {
    const isNull = nullCheck(customData.expression);
    if (isNull) {
      const isUpdate = customDataUpdate(customData);
      if (!isUpdate) {
        customDataCreate(customData);
      }
    }
  };

  // 사용자 정의 데이터 신규 추가
  const customDataCreate = (customData) => {
    setCustomDataList((prev)=>{
      return [
        ...prev,
        customData
      ];
    });
    setCustomData((prev)=>{
      return {
        ...prev,
        fieldId: prev.fieldId + 1
      };
    });
  };

  // 사용자 정의 데이터 업데이트
  const customDataUpdate = (customData) => {
    let isUpdate = false;
    let lastFireldId = 0;
    // 사용자 정의 데이터 값 업데이트
    setCustomDataList((prev)=>{
      return prev.map((item)=>{
        lastFireldId = item.fieldId;
        if (item.fieldId === customData.fieldId) {
          isUpdate = true;
          return customData;
        } else {
          return item;
        }
      });
    });
    // 사용자 정의 데이터 값 초기화
    if (isUpdate) {
      setCustomData({
        customDataInitial,
        fieldId: lastFireldId + 1});
    }
    return isUpdate;
  };

  const handleException = () => {
    let isok = true;
    // 사용자 정의 데이터 NULL 체크
    customDataList.forEach((item)=>{
      isok = nullCheck(item.fieldName, item.expression, item.type);
      if (isok === false) {
        return isok;
      }
    });

    return isok;
  };

  // 리덕스 STATE 저장
  // TODO: 데이터베이스 값 저장은 보고서 저장 클릭시 진행
  const handleConfirm = () => {
    let isok = false;
    if (!handleException()) {
      alert(localizedString.alertInfo.customData.empty);
      isok = true;
    };
    return isok;
  };

  // 취소
  const handleCancel = () => {
    return props.onClose();
  };

  return (
    <CustomDataContext.Provider
      value={context}
    >
      <Modal
        onSubmit={() => {
          if (handleConfirm()) {
            return true;
          } else {
            return false;
          }
        }}
        onClose={()=>{
          return handleCancel();
        }}
        height='450px'
        width='750px'
        modalTitle={localizedString.customData.title}
      >
        <Wrapper display="flex" direction="row">
          <Wrapper size="100%">
            <CustomData
              allowColumnReordering={true}
              rowAlternationEnabled={true}
              showBorders={true}
              width="100%"
            />
          </Wrapper>
        </Wrapper>
      </Modal>
    </CustomDataContext.Provider>
  );
};

export default CustomDataModal;
