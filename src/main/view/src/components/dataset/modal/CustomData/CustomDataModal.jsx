import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from '../../../../config/localization';
import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import CustomData
  from 'components/dataset/atomic/organism/CustomData/CustomData';
import {createContext, useEffect, useState} from 'react';
import CustomDataCalcModal from './CustomDataCalcModal';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {measuresFetch} from 'redux/modules/SeriesOption/SeriesOptionSlice';
import {getMeasuresValueUpdateFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {
  customDataInitial,
  handleException
} from './utility';
import {
  makeCustomDataFieldIcon,
  uniqueNameType
} from 'components/dataset/utils/DatasetUtil';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {getNewDataField}
  from 'components/common/atomic/DataColumnTab/utils/utility';
import _ from 'lodash';

export const CustomDataContext = createContext();

const CustomDataModal = ({selectedDataSource, orgDataset, ...props}) =>{
  // UseState
  const [customDataList, setCustomDataList] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const [moveToPage, setMoveToPage] = useState(false);
  const [createCustom, setCreateCustom] = useState(false);
  const [updateCustom, setUpdateCustom] = useState(false);
  const [customData, setCustomData] = useState(customDataInitial);
  const [dataset] = useState(_.cloneDeep(orgDataset));

  // Dispatch and Modal
  const dispatch = useDispatch();
  const {openModal, alert} = useModal();

  // Actions
  const {updateDataset} = DatasetSlice.actions;

  // Selector
  const selectedReportId = useSelector(selectCurrentReportId);
  const selectedCurrentDataset = useSelector(selectCurrentDataset);
  const selectedCurrentDataField = useSelector(selectCurrentDataField);
  if (!selectCurrentDataField) return;

  const dataField = _.cloneDeep(selectedCurrentDataField);
  // Context
  const context = {
    state: {
      selectedRowKey: [
        selectedRowKey,
        setSelectedRowKey
      ],
      moveToPage: [
        moveToPage,
        setMoveToPage
      ],
      createCustom: [
        createCustom,
        setCreateCustom
      ],
      updateCustom: [
        updateCustom,
        setUpdateCustom
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
    if (moveToPage) {
      if (updateCustom) handleUpdateCustom();
      else if (createCustom) handleCreateCustom();
    }
    return () => {
      setMoveToPage(false);
      setCreateCustom(false);
      setUpdateCustom(false);
    };
  }, [moveToPage, createCustom, updateCustom]);

  const handleCreateCustom = () => {
    handleModal();
  };

  const handleUpdateCustom = () => {
    if (customData.expression) handleModal();
    else alert('업데이트할 로우가 선택되지 않았습니다.');
  };

  // 데이터 집합 및 사용자 정의 데이터 필드
  const getAllCurrentFields = () => {
    return dataset.fields.filter((item) => item.type != 'FLD');
  };

  // 데이터 집합 필드
  const getCurrentFields = () => {
    return dataset.fields.filter((item) =>
      item.uniqueName != uniqueNameType.CUSTOM_DATA &&
      item.parentId != uniqueNameType.CUSTOM_DATA);
  };

  const reduxFetchCustomDataList = (dataset) => {
    if (dataset.fields) {
      const fetchCustomDataList =
        dataset.fields.filter((item) =>
          item.type != 'FLD' && item.parentId == uniqueNameType.CUSTOM_DATA);
      fetchCustomDataList.forEach((item, index) => {
        setCustomDataList((prev) => {
          return [
            ...prev,
            {
              fieldId: index + 1,
              fieldName: item.uniqueName,
              expression: item.expression,
              type: 'numeric'
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

  const extractMeasureByRegex = (str) => {
    const regex = /\[([^\]]+)\]/g;
    const matches = [...str.matchAll(regex)];
    const extractedData = matches.map((match) => match[1]);
    return extractedData;
  };

  const getTemporaryMeasures = (measures, customData) => {
    const expressions = customData
        .filter((fd) => fd.type === 'MEA')
        .map((md) => md.expression);
    const cleaningMeasure = new Set();
    expressions.forEach((expression) => {
      const extractedMeasures = extractMeasureByRegex(expression);
      extractedMeasures.forEach((measure) => cleaningMeasure.add(measure));
    });

    /*
    dataField.measure.forEach((measure) => {
      if ([...cleaningMeasure].includes(measure.name)) {
        cleaningMeasure.delete(measure.name);
      }
    });
    */

    return measures.filter((measure) =>
      [...cleaningMeasure].includes(measure.name));
  };

  const reduxUpdateCustomDataList = (tempFields) => {
    const fields = getCurrentFields();
    const measures = selectedCurrentDataset.fields.filter((field) =>
      field.type == 'MEA' && !(field?.isCustomData));
    if (!fields) return;
    let isok = false;
    const temporaryMeasures = getTemporaryMeasures(measures, tempFields);
    if (tempFields) {
      dispatch(updateDataset({
        reportId: selectedReportId,
        dataset: {
          ...dataset,
          fields: [...fields, ...tempFields],
          customDatas: {
            customData: [...tempFields],
            measures: temporaryMeasures?.map((measure) => {
              return getNewDataField(dataField, false, measure, false);
            })
          }
        }
      }));
      isok = true;
    };
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
    const isNull = customData?.expression;
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
    let lastFieldId = 0;
    // 사용자 정의 데이터 값 업데이트
    setCustomDataList((prev)=>{
      return prev.map((item)=>{
        lastFieldId = item.fieldId;
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
        fieldId: lastFieldId + 1});
    }
    return isUpdate;
  };

  // 리덕스 STATE 저장
  const handleConfirm = () => {
    let isOk = false;
    if (!handleException(customDataList)) {
      alert(localizedString.alertInfo.customData.empty);
      return !isOk;
    };
    const tempFields = makeCustomDataFieldIcon(customDataList);

    if (!reduxUpdateCustomDataList(tempFields)) {
      alert(localizedString.alertInfo.customData.empty);
      isOk = true;
    };

    if (!isOk) {
      const customDatas = tempFields.filter((item) => item.type === 'MEA');
      const measuresUpdateFormat = getMeasuresValueUpdateFormat();
      measuresUpdateFormat.customDatas = customDatas;
      measuresUpdateFormat.reportId = selectedReportId;
      dispatch(measuresFetch(measuresUpdateFormat));
    }

    return isOk;
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
