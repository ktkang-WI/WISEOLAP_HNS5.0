import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection, Button} from 'devextreme-react/data-grid';
import styled from 'styled-components';
import addHighLightIcon
  from 'assets/image/icon/button/ico_zoom.png';
import {createContext, useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectCurrentItems, selectRootItem}
  from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import _ from 'lodash';
import DataHighlightForm from
  '../../molecules/datahighlightForm/DataHighlightForm';
import useModal from 'hooks/useModal';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from '../../../../../../config/configType';
import deleteReport from 'assets/image/icon/button/crud_remove.png';
import DimensionHighlightForm
  from '../../molecules/datahighlightForm/DimensionHighlightForm';
import {
  getIdxAndFlag,
  getNames,
  getValidation,
  setMeta
} from './DataHighlightUtil';

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
  applyCell: true,
  applyTotal: true,
  applyGrandTotal: true,
  status: 'new'
};

const selectedReportTypeHighlight = (selectedItem, reportType) => {
  if (reportType === 'AdHoc') {
    return selectedItem[1].meta.dataHighlight.length !=0 ?
          selectedItem[1].meta.dataHighlight : [];
  } else if (reportType === 'DashAny') {
    return selectedItem.meta.dataHighlight.length !=0 ?
          selectedItem.meta.dataHighlight : [];
  };
};

export const highlightFormContext = createContext(null);

const DataHighlightModal = ({...props}) => {
  const {updateItem} = ItemSlice.actions;

  const dispatch = useDispatch();
  const {alert, confirm} = useModal();

  const reportId = useSelector(selectCurrentReportId);
  const reportType = useSelector(selectCurrentDesignerMode);
  const rootItem = useSelector(selectRootItem);

  const selectedItem = reportType === DesignerMode['AD_HOC'] ?
      useSelector(selectCurrentItems) : useSelector(selectCurrentItem);
  const ref = useRef(null);
  const [highlightList, setHighlightList] =
    useState(
        [...selectedReportTypeHighlight(selectedItem, reportType)]
    );
  // 하이라이트 목록 중 하나를 선택 시 하이라이트 정보에 보여줌.
  const [formData, setData] = useState(_.cloneDeep(init));
  // 하이라이트에 존재하는 목록을 전부 삭제시, 전부 삭제한 부분도 update되야 함.
  const [showField, setShowField] = useState(false);
  const [page, setPage] = useState('measure');

  // index 값 가져올 떄 넣어서 가져오기.
  const measureNames = useMemo(
      () => getNames(reportType, rootItem, selectedItem).measures, []);

  const dimNames = useMemo(() => {
    const dimensions = getNames(reportType, rootItem, selectedItem).dimensions;
    const onlyNames = dimensions.rows.concat(dimensions.cols);

    return onlyNames;
  }, []);

  // 동일 필드명, 조건이면 정보 업데이트.
  const appliedHighlight = (formData) => {
    const copyHighlight = [...highlightList];

    if (_.isEmpty(formData)) {
      return copyHighlight;
    }
    // 선택한 측정값, 차원의 순서(인덱스)를 가져옴.
    const idxAndFlag =
      getIdxAndFlag(formData, reportType, rootItem, selectedItem);

    const idx = idxAndFlag.idx;
    const flag = idxAndFlag.flag;

    const highlightData = {...formData, idx: idx, flag: flag};
    const findIdx = copyHighlight.findIndex(
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
      delete highlightData.status;
      copyHighlight.push(highlightData);
    } else if (findIdx != -1 && formData.status == 'update') {
      delete highlightData.status;
      copyHighlight[findIdx] = highlightData;
    }
    return copyHighlight;
  };

  // 하이라이트 목록에 추가.
  const onClick = () => {
    const formData = ref.current.props.formData;
    const highlight = appliedHighlight(formData);
    console.log('formData:', formData);
    console.log('dataFilterInfo:', dataFilterInfo);

    if (highlight === false) {
      alert(localizedString.highlightDupleCheck1);
      setData({...init});
      return;
    }

    validation(formData, highlight);
  };

  // 유효성 검사.
  const validation = (formData, highlight, flag) => {
    console.log('formData:', formData);
    console.log('highlight:', highlight);
    console.log('flag:', flag);
    const alertMsg = getValidation(formData);

    if (alertMsg) {
      alert(alertMsg);

      return false;
    }

    if (!flag) {
      setHighlightList(highlight);
      setData(_.cloneDeep(init));
      setShowField(false);
    }

    return true;
  };

  // 하이라이트 삭제 부분.
  const deleteHighlightList = (data) => {
    if (data.row && highlightList.length != 0) {
      confirm(localizedString.deleteHighlight, () => {
        const deletedHighlight = highlightList.filter(
            (highlight) => highlight !== data.row.key
        );

        setData({...init});
        setHighlightList(deletedHighlight);
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
        const popupName = 'dataHighlight';
        const formData = _.cloneDeep(ref.current.props.formData);
        const isNullData = formData.type === 'dimension'?
          formData.dataItem: (formData.dataItem && formData.condition);
        let resultHighlightList = [];
        const newFormData = !isNullData ? [] : formData;

        const highlight = appliedHighlight(newFormData);

        if (!highlight) {
          alert(localizedString.highlightDupleCheck2);
          setData({...init});
          return true;
        }
        // 적용 전 유효성 검사.
        const isInvalid =
          highlight.some((item) => !validation(item, highlight, 'flag'));

        if (isInvalid) return isInvalid;

        if (isNullData) {
          resultHighlightList= highlight;
        } else if (highlightList.length != 0) {
          resultHighlightList = highlightList;
        }

        const selectItem =
            Array.isArray(selectedItem) ? selectedItem[1] : selectedItem;

        const item = setMeta(selectItem, popupName, resultHighlightList);
        dispatch(updateItem({reportId: reportId, item: item}));
        return;
      }}
      height={theme.size.bigModalHeight}
      width={'calc(' + theme.size.bigModalWidth + ' - 70px)'}
      modalTitle={localizedString.dataHighlight}
      {...props}
    >
      <StyledWrapper>
        <ModalPanel
          title={localizedString.dataHighlightList}
          width='60%'
          padding='10'>
          <AddBtn src={addHighLightIcon} onClick={onClick}/>
          <CommonDataGrid
            width='100%'
            dataSource={highlightList}
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
            <Column caption={'구분'} dataField='type' cellRender={typeCaption}>
            </Column>
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
                onClick={deleteHighlightList}
                hint={localizedString.deleteReport}
              />
            </Column>
          </CommonDataGrid>
        </ModalPanel>
        <ModalPanel
          title={
            localizedString[page || 'measure']+
            ' ' + localizedString.dataHighlightInfo
          }
          width='40%'
          padding='10'>
          <highlightFormContext.Provider value={{
            ref,
            setData,
            showField,
            measureNames,
            dimNames,
            highlightList,
            setHighlightList,
            setShowField,
            formData,
            setPage,
            page
          }}>
            {(page == null || page == 'measure') ?
              <DataHighlightForm /> : <DimensionHighlightForm />}
          </highlightFormContext.Provider>
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataHighlightModal;
