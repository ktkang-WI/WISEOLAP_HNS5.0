import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from '../../../../config/localization';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomData
  from 'components/dataset/atomic/organism/CustomData/CustomData';
import {createContext, useEffect, useState} from 'react';
import CustomDataCalcModal from './CustomDataCalcModal';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';

export const CustomDataContext = createContext();

const CustomDataModal = ({selectedDataSource, orgDataset, ...props}) =>{
  // TODO: 직접쿼리 입력과 틀 맞춤
  const generateFields = (tempFields) => {
    let generatedFields = null;
    generatedFields = tempFields.map((field) => {
      return {
        isCustomData: true,
        icon: meaImg,
        parentId: '987654321',
        uniqueName: field.fieldName,
        name: field.fieldName,
        expression: field.expression,
        type: 'MEA'
      };
    });
    generatedFields.unshift({
      name: '계산된 필드',
      type: 'FLD',
      parentId: '0',
      uniqueName: '987654321',
      icon: folderImg
    });
    return generatedFields;
  };

  const customDataInitial = () => {
    return {
      fieldId: 1,
      fieldName: '',
      expression: '',
      type: 'decimal'
    };
  };

  // UseState
  const [customDataList, setCustomDataList] = useState([]);
  const [moveToPage, setMoveToPage] = useState(false);
  const [customData, setCustomData] = useState(customDataInitial);
  const [dataset] = useState(_.cloneDeep(orgDataset));

  // Dispatch and Modal
  const dispatch = useDispatch();
  const {openModal, alert} = useModal();

  // Actions
  const {updateDataset} = DatasetSlice.actions;

  // Selector
  const selectedReportId = useSelector(selectCurrentReportId);

  // Context
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

  // 초기화
  useEffect(() => {
    // redux 사용자 정의 데이터 가져오기.
    reduxFetchCustomDataList(dataset);
  }, []);

  // Modal 이동 감지기
  useEffect(() => {
    if (moveToPage) handleModal();
    return () => {
      setMoveToPage(false);
    };
  }, [moveToPage]);

  // 데이터 집합 및 사용자 정의 데이터 필드
  const getAllCurrentFields = () => {
    return dataset.fields.filter((item) => item.type != 'FLD');
  };

  // 데이터 집합 필드
  const getCurrentFields = () => {
    return dataset.fields.filter((item) =>
      item.uniqueName != '987654321' && item.parentId != '987654321');
  };

  // TODO: 함수명 이름추천 해주면 좋을듯 합니다.
  const reduxFetchCustomDataList = (dataset) => {
    if (dataset.fields) {
      const fetchCustomDataList =
        dataset.fields.filter((item) =>
          item.type != 'FLD' && item.parentId == '987654321');
      fetchCustomDataList.forEach((item, index) => {
        setCustomDataList((prev) => {
          return [
            ...prev,
            {
              fieldId: index + 1,
              fieldName: item.uniqueName,
              expression: item.expression,
              type: 'decimal'
            }
          ];
        });
      });
      setCustomData((prev) => {
        return {
          ...prev,
          fieldId: fetchCustomDataList.length + 1
        };
      });
    }
  };

  // TODO: 함수명 이름추천 해주면 좋을듯 합니다.
  const reduxUpdateCustomDataList = (tempFields) => {
    const fields = getCurrentFields();

    let isok = false;
    if (tempFields) {
      dispatch(updateDataset({
        reportId: selectedReportId,
        dataset: {
          ...dataset,
          fields: [...fields, ...tempFields]
        }
      }));
      isok = true;
    };
    return isok;
  };

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
        allFields: getAllCurrentFields(),
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
    const tempFields = generateFields(customDataList);

    if (!reduxUpdateCustomDataList(tempFields)) {
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
