import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from '../../../../config/localization';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomDataList
  from 'components/dataset/atomic/molecules/CustomData/CustomDataList';
import {createContext, useEffect, useState} from 'react';
import CustomDataCalcModal from './CustomDataCalcModal';

/* 사용자 정의 데이터
@Autor : KIM JAE HYEON
@Date : 20231214 */
export const CustomDataContext = createContext();

const CustomDataModal = ({...props}) =>{
  // #################################### 변수 선언 시작
  const customDataInitial = () => {
    return {
      fieldId: 1,
      fieldName: '',
      calculation: '',
      type: ''
    };
  };
  const {openModal, alert} = useModal();
  // TODO: 리덕스 데이터 가져오기 구현
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
  // #################################### 변수 선언 종료
  // #################################### 초기화 시작
  useEffect(()=>{
    if (moveToPage) handleModal();
    return () => {
      setMoveToPage(false);
    };
  }, [moveToPage]);
  // #################################### 초기화 종료
  // #################################### 함수 시작
  // TODO: NULL 공용 함수로 이동유무 결정
  const nullCheck = (...args) => {
    let isok = true;
    args.forEach((item)=>{
      if (item === null || item === '' || item === undefined) {
        isok = false;
      }
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
    const isNull = nullCheck(customData.calculation);
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
      isok = nullCheck(item.fieldName, item.calculation);
      if (isok === false) {
        return isok;
      }
    });

    return isok;
  };

  // 리덕스 STATE 저장
  // TODO: 데이터베이스 값 저장은 보고서 저장 클릭시 진행
  const handleConfirm = () => {
    let isok = true;
    if (!handleException()) {
      alert('필드명,계산식의 빈값이 있습니다.');
      isok = false;
    };
    return isok;
  };

  // 취소
  const handleCancel = () => {
    return props.onClose();
  };
  // #################################### 함수 종료

  return (
    <CustomDataContext.Provider
      value={context}
    >
      <Modal
        onSubmit={() => {
          if (!handleConfirm()) {
            return false;
          } else {
            return true;
          }
        }}
        onClose={()=>{
          return handleCancel();
        }}
        height={localizedString.userDefinedData.styles.height}
        width={localizedString.userDefinedData.styles.width}
        modalTitle={localizedString.userDefinedData.title}
      >
        <Wrapper display="flex" direction="row">
          <Wrapper size="100%">
            <CustomDataList
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
