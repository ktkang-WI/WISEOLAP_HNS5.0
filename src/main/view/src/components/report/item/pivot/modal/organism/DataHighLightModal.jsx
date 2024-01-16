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
import store from 'redux/modules';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import _ from 'lodash';
import MakeForm from '../molecules/MakeForm';
import useModal from 'hooks/useModal';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';

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

const selectedReportTypeHighlight = (selectedItem, reportType) => {
  if (reportType === 'AdHoc') {
    return selectedItem[1].meta.dataHighlight.lengh !=0 ?
          selectedItem[1].meta.dataHighlight : [];
  } else if (reportType === 'DashAny') {
    return selectedItem.meta.dataHighlight.lengh !=0 ?
          selectedItem.meta.dataHighlight : [];
  };
};

const DataHighlightModal = ({popupName, modalTitle, ...props}) => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const rootItem = useSelector(selectRootItem);
  const reportType = selectCurrentDesignerMode(store.getState());
  const selectedItem = reportType === DesignerMode['AdHoc'] ?
      useSelector(selectCurrentItems) : useSelector(selectCurrentItem);
  const reportId = selectCurrentReportId(store.getState());
  const {updateItem} = ItemSlice.actions; // state에 dataHighligh 목록 추가.
  const [highlightList, setHighlightList] = // 모달 창에서만 사용 하므로 useState로 목록을 보여줌.
    useState(
        [...selectedReportTypeHighlight(selectedItem, reportType)]
    ); // 이미 하이라이트 목록이 있다면 모달창을 불러올 때 같이 불러옴.
  const [data, setData] = useState({}); // 하이라이트 목록 중 하나를 선택 시 선택 Form에 정보를 보여줌.
  const [isUpdate, setIsUpdate] = useState(false);
  const ref = useRef(null);
  const measureNames = useMemo(() => {
    if (reportType === 'AdHoc') {
      return rootItem.adHocOption.dataField.measure.map((mea) => mea.name);
    } else if (reportType === 'DashAny') {
      return selectedItem.meta.dataField.measure.map((mea) => mea.name);
    }
  }, []); // 데이터항목에 올라간 측정값을 가져옴.

  const onClick = () => { // 하이라이트 추가 부분.
    const copyHighlight = [...highlightList];
    const formData = _.cloneDeep(ref.current.props.formData);

    // 선택한 측정값의 인덱스를 가져옴.
    const idx = measureNames.findIndex((measure) =>
      measure == formData.dataItem
    );

    const highlightData = {...formData, idx: idx};

    const findIdx = copyHighlight.findIndex((highlight) =>
      highlight.dataItem == formData.dataItem
    ); // 추가 된 하이라이트 정보가 있는지 찾음.

    if (copyHighlight.length == 0) { // 첫 추가
      copyHighlight.push(highlightData);
    } else if (findIdx == -1) { // 2번째 추가 부터 같은 fieldName이 없으면 새로 추가
      copyHighlight.push(highlightData);
    } else { // 같은 fieldName있으면 변경.
      copyHighlight[findIdx] = {...highlightData};
    }

    // 유효성 검사.
    if (!formData.dataItem ||! formData.condition ||!formData.valueFrom) {
      alert('데이터항목, 조건유형, 조건 값은 필수 입력 항목입니다.');
    } else if (isNaN(Number(formData.valueFrom))) {
      alert('조건 값은 숫자만 입력해 주세요.');
    } else {
      if (formData.condition === 'Between' && formData.valueTo === undefined) {
        alert('조건유형 Between은 조건 값(To)도 필수 입력입니다.');
      } else if (Number(formData.valueFrom) > Number(formData.valueTo)) {
        alert('조건 값(To)가 조건 값(From)보다 커야 합니다.');
      } else {
        setHighlightList(copyHighlight);
        const init = {applyCell: true, applyTotal: true, applyGrandTotal: true};
        setData(init);
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
          (highlight)=> highlight.dataItem !== data[0].key.dataItem
      );
      setData({});
      setHighlightList(deletedHighlight);
      setIsUpdate(true);
    }
  };

  return (
    <Modal
      onSubmit={() => {
        if (highlightList.length == 0 && !isUpdate) {
          // Alert
          alert('하이라이트 목록을 추가해 주세요.');
          return true;
        } else {
          const selectItem =
            Array.isArray(selectedItem) ? selectedItem[1] : selectedItem;
          const item = setMeta(selectItem, popupName, highlightList);
          dispatch(updateItem({reportId: reportId, item: item}));
          return;
        }
      }}
      height={theme.size.bigModalHeight}
      width={'calc(' + theme.size.bigModalWidth + ' - 70px)'}
      modalTitle={modalTitle}
      {...props}
    >
      <StyledWrapper>
        <ModalPanel
          title={localizedString.datahighlightList}
          width='60%'
          padding='10'>
          <AddBtn src={addHighLightIcon} onClick={onClick}/>
          <CommonDataGrid
            width='100%'
            dataSource={highlightList}
            onCellClick={(e) => { // 추가된 하이라이트 목록을 클릭 할 때 동작.
              const rowData = _.cloneDeep(e.row ?
                e.row.data :
                {applyCell: true, applyTotal: true, applyGrandTotal: true});

              setData(rowData);
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
          title={localizedString.datahighlightInfo}
          width='40%'
          padding='10'>
          {/* <Form>이 정리 된 곳. */}
          <MakeForm ref={ref} formData={data} measureNames={measureNames}/>
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataHighlightModal;
