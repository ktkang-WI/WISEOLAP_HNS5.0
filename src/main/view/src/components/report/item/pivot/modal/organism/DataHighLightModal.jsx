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
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useDispatch} from 'react-redux';
import store from 'redux/modules';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import _ from 'lodash';
import MakeForm from '../molecules/MakeForm';
import useModal from 'hooks/useModal';

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

const DataHighLightModal = ({...props}) => {
  const dispatch = useDispatch();
  const {alert} = useModal();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = selectCurrentReportId(store.getState());
  const {insertDataHighlight} = ItemSlice.actions;
  const [highlightList, setHighlightList] =
    useState(
      selectedItem.meta.highlight.lengh !=0 ? selectedItem.meta.highlight : []
    );
  const [data, setData] = useState({});
  const ref = useRef(null);
  const measureNames = useMemo(() => selectedItem.meta.dataField.measure.map(
      (mea) => mea.name
  ), []);

  const onClick = () => {
    // 1. 같은 필드명 추가 불가. 2. 이미 추가된 필드명을 다시 선택 후 내용 변경 시 업데이트만, 필드명 변경시 새로 추가.
    const copyHighlight = [...highlightList];
    const formData = _.cloneDeep(ref.current.props.formData);

    const idx = measureNames.findIndex((measure, idx) =>
      measure == formData.dataItem
    );

    const highlightData = {...formData, idx: idx};

    const findIdx = copyHighlight.findIndex((highlight) =>
      highlight.dataItem == formData.dataItem
    );

    if (copyHighlight.length == 0) { // 첫 추가
      copyHighlight.push(highlightData);
    } else if (findIdx == -1) { // 2번째 추가 부터 같은 fieldName이 없으면 새로 추가
      copyHighlight.push(highlightData);
    } else { // 같은 fieldName있으면 변경.
      copyHighlight[findIdx] = {...highlightData};
    }

    if (formData.dataItem === undefined ||
        formData.condition === undefined ||
        formData.valueFrom === undefined) {
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
  const deleteHighlightList = (e) => {
    if (e[0] && highlightList.length != 0) {
      const deletedHighlight = highlightList.filter(
          (highlight)=> highlight.dataItem !== e[0].key.dataItem
      );
      setHighlightList(deletedHighlight);
    }
  };
  return (
    <Modal
      onSubmit={ async () => {
        if (highlightList.length == 0) {
          // Alert
          alert('하이라이트 목록을 추가해 주세요.');
          return true;
        } else {
          dispatch(
              insertDataHighlight(
                  {reportId: reportId, highlight: highlightList})
          );
          return;
        }
      }}
      height={theme.size.bigModalHeight}
      width={'calc(' + theme.size.bigModalWidth + ' - 70px)'}
      modalTitle={localizedString.datahighlight}
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
            dataSource={highlightList} // 클론으로 변경. idx도 가죠옴.
            onCellClick={(e) => {
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
          {/* molecule에서 정리 */}
          <MakeForm ref={ref} formData={data} measureNames={measureNames}/>
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataHighLightModal;
