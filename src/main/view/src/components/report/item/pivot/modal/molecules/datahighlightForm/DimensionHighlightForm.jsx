import {Form} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {highlightFormContext}
  from '../../organism/datahighlight/DataHighLightModal';
import React, {useContext} from 'react';
import useModal from 'hooks/useModal';

const DimensionHighlightForm = () => {
  const {alert} = useModal();
  const {
    setHighlightList,
    highlightList,
    formData,
    dimNames,
    setPage,
    setData,
    page,
    ref
  } = useContext(highlightFormContext);
  return (
    <Form
      formData={formData}
      ref={ref}
      onFieldDataChanged={(e) => {
        // 하이라이트 정보 변경 시 +버튼 클릭 없어도 바로 적용.
        const copyHighlight = _.cloneDeep(highlightList);

        const findIdx = copyHighlight.findIndex(
            (data) => (data.dataItem === formData.dataItem &&
            data.condition === formData.condition)
        );
        // 데이터항목, 조건 유형, 조건 값이 아닌 값 변경 시
        let isOtherChange = true;
        if (findIdx != -1) {
          if (e.dataField == 'dataItem') {
            if (copyHighlight[findIdx][e.dataField] == e.value) {
              isOtherChange = false;
            }
          }
        }

        if (formData.rowIdx != undefined && formData.status == 'update') {
          if (formData.valueTo && formData.valueFrom) {
            if (Number(formData.valueFrom) > Number(formData.valueTo)) {
              alert(localizedString.highlightBetweenValueCompareMsg);
            }
          }
          if (isOtherChange) {
            copyHighlight[formData.rowIdx] = formData;
            setHighlightList(copyHighlight);
          } else {
            alert(localizedString.highlightDupleCheck2);
            setData({
              applyCell: true,
              applyTotal: true,
              applyGrandTotal: true,
              status: 'new'
            });
          }
        }
      }}
    >
      <Item
        name='type'
        dataField='type'
        editorType='dxSelectBox'
        editorOptions={{
          items: localizedString.dataItemTypeList,
          value: page || 'dimension',
          valueExpr: 'name',
          displayExpr: 'caption',
          onValueChanged: (e) => {
            setPage(e.value || 'dimension');
          },
          disabled: formData.dataItem ?? false
        }}>
        <Label>{localizedString.dataItemType}</Label>
      </Item>
      <Item
        name='dataItem'
        dataField='dataItem'
        editorType='dxSelectBox'
        editorOptions={{
          items: dimNames
        }}>
        <Label>{localizedString.dataItem}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      <Item
        name='backgroundColor'
        dataField='backgroundColor'
        editorType='dxColorBox'>
        <Label>{localizedString.backgroundColor}: </Label>
      </Item>
      <Item
        name='fontColor'
        dataField='fontColor'
        editorType='dxColorBox'>
        <Label>{localizedString.fontColor}: </Label>
      </Item>
      {/* <Item
        name='applyCell'
        dataField='applyCell'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyCell}: </Label>
      </Item> */}
      <Item
        name='applyTotal'
        dataField='applyTotal'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyTotal}: </Label>
      </Item>
      {/* <Item
        name='applyGrandTotal'
        dataField='applyGrandTotal'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyGrandTotal}: </Label>
      </Item> */}
    </Form>
  );
};
export default React.forwardRef(DimensionHighlightForm);
