import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from '../../../../../config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import {Column, Selection} from 'devextreme-react/data-grid';
import styled from 'styled-components';
import addHighLightIcon
  from '../../../../../assets/image/icon/button/ico_zoom.png';
import {Form} from 'devextreme-react';
import {useState} from 'react';
// import {useLocation} from 'react-router';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {GroupItem, Item} from 'devextreme-react/form';
import {useRef} from 'react';

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
  // const location = useLocation(); // adhoc 피벗, dashboard 피벗 meta 분기.
  const [highlightList, setHighlightList] = useState([]); // State로 변경.
  const formData = {};
  const ref = useRef(null);
  const selectedItemId = useSelector(selectCurrentItem);
  const onClick = () => { // 같은 필드명을 선택 후 변경시 예외처리.
    // 1. 같은 필드명 추가 불가. 2. 이미 추가된 필드명을 다시 선택 후 내용 변경 시 업데이트만, 필드명 변경시 새로 추가.
    // console.log('eeees');
    console.log(selectedItemId);
    // console.log(ref.current.props);
    const copy = [...highlightList];
    const highlightData = ref.current.props.formData;
    copy.push(highlightData);
    setHighlightList(copy);
  };

  console.log(highlightList);

  return (
    <Modal
      onSubmit={ async () => {
        console.log(highlightList);
        if (highlightList.length == 0) {
          // Alert
          console.log('alert');
          return true;
        }
        return true;
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
            dataSource={highlightList} // 기존 WI 에서 불러올 때도.
            onSelectionChanged={(e) => {
              console.log(e);
              // setFormData(e.selectedRowsData[0]);
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
          <Form
            formData={formData}
            ref={ref}
          >
            <GroupItem colCount={1}>
              <Item
                name='dataItemField'
                dataField='fieldName'
                caption='데이터항목'
                editorType='dxSelectBox'
                editorOptions={{
                  items: ['test1', 'test2', 'test3'] // meta에서 measure 가져옴
                }}
                validationRules={''}>
              </Item>
              <Item
                name='conditionType'
                dataField='condition'
                caption='조건 유형'
                editorType='dxSelectBox'
                editorOptions={{
                  items: ['=', '>', '<']
                }}
                validationRules={''}>
              </Item>
              <Item
                dataField='backgroundColor'
                editorType='dxColorBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                dataField='fontColor'
                editorType='dxColorBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                dataField='valueFrom'
                editorType='dxTextBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                dataField='valueTo'
                editorType='dxTextBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                name='emoji'
                dataField='emojiList'
                caption='조건 유형'
                editorType='dxSelectBox'
                editorOptions={{
                  items: ['=', '>', '<']
                }}
                validationRules={''}>
              </Item>
              <Item
                dataField='applyCell'
                editorType='dxCheckBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                dataField='applyTotal'
                editorType='dxCheckBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
              <Item
                dataField='applyGrandTotal'
                editorType='dxCheckBox'
                editorOptions={''}
                validationRules={''}>
              </Item>
            </GroupItem>
          </Form>
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};
export default DataHighLightModal;
