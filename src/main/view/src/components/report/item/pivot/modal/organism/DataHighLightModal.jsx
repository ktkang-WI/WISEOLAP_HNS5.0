import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from '../../../../../../config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
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
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = selectCurrentReportId(store.getState());
  const {dataHighlight} = ItemSlice.actions;
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
      measure == formData.fieldName
    );

    const highlightData = {...formData, idx: idx};

    const findIdx = copyHighlight.findIndex((highlight) =>
      highlight.fieldName == formData.fieldName
    );

    if (copyHighlight.length == 0) { // 첫 추가
      copyHighlight.push(highlightData);
    } else if (findIdx == -1) { // 2번쨰 부터 같은 fieldName이 없으면 새로 추가
      copyHighlight.push(highlightData);
    } else { // 같은 fieldName있으면 변경.
      // 변경.
      copyHighlight[findIdx] = {...highlightData};
    }

    if (formData.fieldName !== undefined &&
        formData.condition !== undefined &&
        formData.valueFrom !== undefined) {
      if (formData.condition === 'Between' && formData.valueTo === undefined) {
        console.log('Between은 To도 필수 입력');
      } else if (Number(formData.valueFrom) > Number(formData.valueTo)) {
        console.log('To가 From 보다 커야함.');
      } else {
        setHighlightList(copyHighlight);
        const init = {};
        setData(init);
      }
    } else if (typeof Number(formData.valueFrom) != 'number') {
      console.log('조건값 숫자만 입력.');
    } else {
      console.log('alert: 필수입력값 입력.'); // alert로 바꿀 에정.
    }
  };

  return (
    <Modal
      onSubmit={ async () => {
        if (highlightList.length == 0) {
          // Alert
          console.log('alert');
          return true;
        } else {
          dispatch(
              dataHighlight({reportId: reportId, highlight: highlightList})
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
            dataSource={highlightList}
            onCellClick={(e) => {
              const rowData = _.cloneDeep(e.row ? e.row.data : {});
              setData(rowData);
            }}
          >
            <Selection mode='single'/>
            <Column caption={localizedString.fieldName} dataField='fieldName'/>
            <Column caption={localizedString.condition} dataField='condition'/>
            <Column
              caption={localizedString.conditionValue + '(From)'}
              dataField='valueFrom'/>
            <Column
              caption={localizedString.conditionValue + '(To)'}
              dataField='valueTo'/>
            <Column />
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
