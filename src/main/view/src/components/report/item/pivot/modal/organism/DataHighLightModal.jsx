import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from '../../../../../../config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Editing, Selection} from 'devextreme-react/data-grid';
import styled from 'styled-components';
import addHighLightIcon
  from '../../../../../../assets/image/icon/button/ico_zoom.png';
import {useMemo, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectCurrentItems, selectRootItem}
  from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import _ from 'lodash';
import DataHighlightForm from '../molecules/DataHighlightForm';
import useModal from 'hooks/useModal';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from '../../../../../config/configType';

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

const DataHighlightModal = ({...props}) => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const reportId = useSelector(selectCurrentReportId);
  const reportType = useSelector(selectCurrentDesignerMode);
  const rootItem = useSelector(selectRootItem);
  const selectedItem = reportType === DesignerMode['AD_HOC'] ?
      useSelector(selectCurrentItems) : useSelector(selectCurrentItem);
  const {updateItem} = ItemSlice.actions;
  // meta에 데이터하이라트 목록을 가져옴. meta에 없으면 빈 배열을 반환.
  const [highlightList, setHighlightList] =
    useState(
        [...selectedReportTypeHighlight(selectedItem, reportType)]
    );
  // 하이라이트 목록 중 하나를 선택 시 하이라이트 정보에 보여줌.
  const [data, setData] = useState(_.cloneDeep(init));
  // 하이라이트에 존재하는 목록을 전부 삭제시, 전부 삭제한 부분도 update되야 함.
  const ref = useRef(null);
  const [showField, setShowField] = useState(false);
  // 데이터항목에 올라간 측정값의 name만 가져옴.
  const measureNames = useMemo(() => {
    if (reportType === DesignerMode['AD_HOC']) {
      return rootItem.adHocOption.dataField.measure.map((mea) => mea.name);
    } else if (reportType === DesignerMode['DASHBOARD']) {
      return selectedItem.meta.dataField.measure.map((mea) => mea.name);
    }
  }, []);

  // 동일 필드명, 조건이면 정보 업데이트.
  const appliedHighlight = (formData) => {
    const copyHighlight = [...highlightList];

    // 선택한 측정값의 순서(인덱스)를 가져옴.
    const idx = measureNames.findIndex((measure) =>
      measure == formData.dataItem
    );

    const highlightData = {...formData, idx: idx};
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

    if (highlight === false) {
      alert(localizedString.highlightDupleCheck1);
      setData(_.cloneDeep(init));
      return;
    }

    // 유효성 검사.
    if (!formData.dataItem || !formData.condition || !formData.valueFrom) {
      alert(localizedString.highlightInputEssentialValueMsg);
    } else if (isNaN(Number(formData.valueFrom))) {
      alert(localizedString.highlightOnlyNumberMsg);
    } else {
      if (formData.condition === 'Between' && formData.valueTo === undefined) {
        alert(localizedString.highlightBetweenValueEssentialMsg);
      } else if (Number(formData.valueFrom) > Number(formData.valueTo)) {
        alert(localizedString.highlightBetweenValueCompareMsg);
      } else {
        setHighlightList(highlight);
        setData(_.cloneDeep(init));
        setShowField(false);
      }
    }
  };

  const setMeta = (item, key, value) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
  };

  // 하이라이트 삭제 부분.
  const deleteHighlightList = (data) => {
    if (data[0] && highlightList.length != 0) {
      const deletedHighlight = highlightList.filter(
          (highlight) => highlight !== data[0].key
      );
      setData(_.cloneDeep(init));
      setHighlightList(deletedHighlight);
    }
  };

  return (
    <Modal
      onSubmit={() => {
        const popupName = 'dataHighlight';
        const formData = _.cloneDeep(ref.current.props.formData);
        const isNullData =
          formData.dataItem && formData.condition ? true : false;
        let resultHighlightList = [];

        const highlight = appliedHighlight(formData);

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
                {...e.row.data, status: 'update', rowIdx: e.rowIndex} :
                {applyCell: true, applyTotal: true, applyGrandTotal: true,
                  status: 'new'});
              rowData.condition === 'Between' && setShowField(true);
              rowData.condition !== 'Between' && setShowField(false);
              setData(_.cloneDeep(rowData));
            }}
          >
            <Selection mode='single'/>
            <Editing
              mode='row'
              allowDeleting={true}
              onChangesChange={deleteHighlightList}
            />
            <Column caption={localizedString.fieldName} dataField='dataItem'/>
            <Column caption={localizedString.condition} dataField='condition'/>
            <Column
              caption={localizedString.conditionValue + '(From)'}
              dataField='valueFrom'/>
            <Column
              caption={localizedString.conditionValue + '(To)'}
              dataField='valueTo'/>
          </CommonDataGrid>
        </ModalPanel>
        <ModalPanel
          title={localizedString.dataHighlightInfo}
          width='40%'
          padding='10'>
          {/* 하이라이트 정보를 구성. dev의 <Form> 사용. */}
          <DataHighlightForm
            ref={ref}
            formData={data}
            measureNames={measureNames}
            showField={showField}
            setShowField={setShowField}
            highlightList={highlightList}
            setHighlightList={setHighlightList}
          />
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataHighlightModal;
