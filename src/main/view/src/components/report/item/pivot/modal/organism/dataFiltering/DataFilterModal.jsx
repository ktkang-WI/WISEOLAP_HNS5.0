import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection, Button} from 'devextreme-react/data-grid';
import styled from 'styled-components';
import addDataFilterInfoIcon
  from 'assets/image/icon/button/ico_zoom.png';
import {createContext, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectCurrentItems, selectRootItem}
  from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import _ from 'lodash';
import DataFilterForm from
  '../../molecules/dataFilterForm/DataFilterForm';
import useModal from 'hooks/useModal';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from '../../../../../../config/configType';
import deleteReport from 'assets/image/icon/button/crud_remove.png';
import {
  getIdxAndFlag,
  getNames,
  getValidation,
  setMeta
} from './DataFilterUtil';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  display: flex;
`;

const AddBtn = styled.img`
  position: absolute;
  right: 41%;
  top: 64px;
  transform: translateX(-50%);
  width: 30px;
  cursor: pointer;
  @media screen and (max-width: 640px) {
    display: none;
  }
`;

const init = {
  status: 'new',
  type: 'measure'
};

const selectedReportTypeDataFiltering = (selectedItem, reportType) => {
  if (reportType === 'AdHoc') {
    return selectedItem[1].meta.dataFiltering.length !=0 ?
          selectedItem[1].meta.dataFiltering : [];
  } else if (reportType === 'DashAny') {
    return selectedItem.meta.dataFiltering.length !=0 ?
          selectedItem.meta.dataFiltering : [];
  };
};

export const dataFilterFormContext = createContext(null);

const DataFilterModal = ({...props}) => {
  const {updateItem} = ItemSlice.actions;

  const dispatch = useDispatch();
  const {alert, confirm} = useModal();

  const reportId = useSelector(selectCurrentReportId);
  const reportType = useSelector(selectCurrentDesignerMode);
  const rootItem = useSelector(selectRootItem);

  const selectedItem = reportType === DesignerMode['AD_HOC'] ?
      useSelector(selectCurrentItems) : useSelector(selectCurrentItem);
  const ref = useRef(null);
  const [dataFiltering, setDataFilteringList] =
    useState(
        [...selectedReportTypeDataFiltering(selectedItem, reportType)]
    );
  // 하이라이트 목록 중 하나를 선택 시 하이라이트 정보에 보여줌.
  const [formData, setData] = useState(_.cloneDeep(init));
  // 하이라이트에 존재하는 목록을 전부 삭제시, 전부 삭제한 부분도 update되야 함.
  const [showField, setShowField] = useState(false);
  const [page, setPage] = useState('measure');

  // index 값 가져올 떄 넣어서 가져오기.
  const measureNames = useMemo(
      () => getNames(reportType, rootItem, selectedItem).measures, []);

  // 동일 필드명, 조건이면 정보 업데이트.
  const appliedDataFiltering = (formData) => {
    const copyDataFilterInfo = [...dataFiltering];

    if (_.isEmpty(formData)) {
      return copyDataFilterInfo;
    }
    // 선택한 측정값, 차원의 순서(인덱스)를 가져옴.
    const idxAndFlag =
      getIdxAndFlag(formData, reportType, rootItem, selectedItem);

    const idx = idxAndFlag.idx;
    const flag = idxAndFlag.flag;

    const FilteredData = {...formData, idx: idx, flag: flag};
    const findIdx = copyDataFilterInfo?.findIndex(
        (data) => (data.dataItem === formData.dataItem &&
          data.condition === formData.condition &&
          data.valueFrom === formData.valueFrom &&
          data.valueTo === formData.valueTo)
    );
    // 하이라이트 추가시 중복된 경우.
    if (findIdx != -1 && formData.status == 'new') {
      return false;
    }

    if (findIdx == -1 || formData.status == 'new') {
      delete FilteredData.status;
      copyDataFilterInfo.push(FilteredData);
    } else if (findIdx != -1 && formData.status == 'update') {
      delete FilteredData.status;
      copyDataFilterInfo[findIdx] = FilteredData;
    }
    return copyDataFilterInfo;
  };

  // 하이라이트 목록에 추가.
  const onClick = () => {
    const formData = ref.current.props.formData;
    const dataFilterInfo = appliedDataFiltering(formData);

    if (dataFilterInfo === false) {
      alert(localizedString.dataFilterInfoDupleCheck);
      setData({...init});
      return;
    }

    validation(formData, dataFilterInfo);
  };

  // 유효성 검사.
  const validation = (formData, dataFilterInfo, flag) => {
    const alertMsg = getValidation(formData);

    if (alertMsg) {
      alert(alertMsg);

      return false;
    }

    if (!flag) {
      setDataFilteringList(dataFilterInfo);
      setData(_.cloneDeep(init));
      setShowField(false);
    }

    return true;
  };

  // 하이라이트 삭제 부분.
  const deleteDataFilteringList = (data) => {
    if (data.row && dataFiltering.length != 0) {
      confirm('선택한 데이터 필터링 정보를 삭제 하시겠습니까?', () => {
        const deletedDataFiltering = dataFiltering.filter(
            (varData) => varData !== data.row.key
        );

        setData({...init});
        setDataFilteringList(deletedDataFiltering);
      });
    }
  };

  const typeCaption = (e) => {
    const type = e.value || 'measure';
    return localizedString[type];
  };

  return (
    <Modal
      onSubmit={() => {
        const popupName = 'dataFiltering';
        const formData = _.cloneDeep(ref.current.props.formData);
        const isNullData = formData.type === 'dimension'?
          formData.dataItem: (formData.dataItem && formData.condition);
        let resultDataFilteringList = [];
        const newFormData = !isNullData ? [] : formData;

        const confirmedDataFiltering = appliedDataFiltering(newFormData);

        if (!confirmedDataFiltering) {
          alert('중복된 조건의 데이터 필터링 정보가 존재합니다.');
          setData({...init});
          return true;
        }
        // 적용 전 유효성 검사.
        const isInvalid =
        confirmedDataFiltering.some(
            (item) => !validation(item, confirmedDataFiltering, 'flag')
        );

        if (isInvalid) return isInvalid;

        if (isNullData) {
          resultDataFilteringList= confirmedDataFiltering;
        } else if (dataFiltering.length != 0) {
          resultDataFilteringList = dataFiltering;
        }

        const selectItem =
            Array.isArray(selectedItem) ? selectedItem[1] : selectedItem;

        const item = setMeta(selectItem, popupName, resultDataFilteringList);
        dispatch(updateItem({reportId: reportId, item: item}));
        return;
      }}
      height={theme.size.bigModalHeight}
      width={'calc(' + theme.size.bigModalWidth + ' - 70px)'}
      modalTitle={'데이터 필터링'}
      {...props}
    >
      <StyledWrapper>
        <ModalPanel
          title={'데이터 필터링 목록'}
          width='60%'
          padding='10'>
          <AddBtn src={addDataFilterInfoIcon} onClick={onClick}/>
          <CommonDataGrid
            width='100%'
            dataSource={dataFiltering}
            onCellClick={(e) => {
              // 추가된 하이라이트 목록을 클릭 할 때 동작. -> 하이라이트 정보에 내용 출력.
              const rowData = _.cloneDeep(e.row ?
                {...e.row.data, status: 'update', rowIdx: e.rowIndex,
                  type: (e.row?.data?.type || 'measure')} :
                {applyCell: true, applyTotal: true, applyGrandTotal: true,
                  status: 'new', type: (e.row?.data?.type || 'measure')});
              rowData.condition === 'Between' && setShowField(true);
              rowData.condition !== 'Between' && setShowField(false);
              const currPage = page;
              setPage(currPage);
              setData(_.cloneDeep(rowData));
            }}
          >
            <Selection mode='single'/>
            <Column caption={'구분'} dataField='type' cellRender={typeCaption}/>
            <Column caption={localizedString.fieldName} dataField='dataItem'/>
            <Column caption={localizedString.condition} dataField='condition'/>
            <Column
              caption={localizedString.conditionValue + '(From)'}
              dataField='valueFrom'/>
            <Column
              caption={localizedString.conditionValue + '(To)'}
              dataField='valueTo'/>
            <Column type="buttons" width={80}>
              <Button
                cssClass='dx-link'
                icon={deleteReport}
                visible={true}
                onClick={deleteDataFilteringList}
                hint={localizedString.deleteReport}
              />
            </Column>
          </CommonDataGrid>
        </ModalPanel>
        <ModalPanel
          title={'데이터 필터링 정보'}
          width='40%'
          padding='10'>
          <dataFilterFormContext.Provider value={{
            ref,
            setData,
            showField,
            measureNames,
            dataFiltering,
            setDataFilteringList,
            setShowField,
            formData
          }}>
            <DataFilterForm/>
          </dataFilterFormContext.Provider>
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataFilterModal;
