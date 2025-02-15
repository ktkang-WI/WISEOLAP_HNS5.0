import {Form, Template} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import localizedString from '../../../../../../../config/localization';
import React, {useContext, useState} from 'react';
import EmojiArr from '../EmojiArr';
import _ from 'lodash';
import useModal from 'hooks/useModal';
import {highlightFormContext}
  from '../../organism/datahighlight/DataHighLightModal';

const DataHighlightForm = () => {
  // 선택한 아이콘 보여줌.
  const [selectedIcon, setSelectedIcon] = useState('');
  const {alert} = useModal();
  const emojiSelectBox = (src) => {
    if (src !== '') {
      return (
        <img
          alt='Custom icon'
          src={src}
          className='custom-icon'
        />
      );
    }
    return (
      <div className='dx-dropdowneditor-icon'></div>
    );
  };

  const {
    formData,
    measureNames,
    showField,
    setShowField,
    highlightList,
    setHighlightList,
    setData,
    ref,
    setPage,
    page
  } = useContext(highlightFormContext);

  return (
    <Form
      formData={formData}
      ref={ref}
      onFieldDataChanged={(e) => {
        if (e.dataField === 'condition' && e.value === 'Between') {
          setShowField(true);
        } else if (e.dataField === 'condition' && e.value !== 'Between') {
          delete formData.valueTo;
          setShowField(false);
        }

        // 하이라이트 정보 변경 시 +버튼 클릭 없어도 바로 적용.
        const copyHighlight = _.cloneDeep(highlightList);

        const findIdx = copyHighlight.findIndex(
            (data) => (data.dataItem === formData.dataItem &&
            data.condition === formData.condition)
        );
        // 데이터항목, 조건 유형, 조건 값이 아닌 값 변경 시
        let isOtherChange = true;
        if (findIdx != -1) {
          const dataFieldList = ['dataItem', 'condition', 'valueFrom'];
          if (dataFieldList.includes(e.dataField)) {
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
          value: page || 'measure',
          valueExpr: 'name',
          displayExpr: 'caption',
          onValueChanged: (e) => {
            setPage(e.value || 'measure');
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
          items: measureNames
        }}>
        <Label>{localizedString.dataItem}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      <Item
        name='condition'
        dataField='condition'
        editorType='dxSelectBox'
        editorOptions={{
          items: ['=', '<>', '>', '>=', '<', '<=', 'Between']
        }}>
        <Label>{localizedString.conditionType}
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
      <Item
        name='valueFrom'
        dataField='valueFrom'
        editorType='dxTextBox'>
        <Label>{localizedString.valueFrom}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      {showField && <Item // show in Between.
        name='valueTo'
        dataField='valueTo'
        editorType='dxTextBox'>
        <Label>{localizedString.valueTo}
          <span className='requireRule'> *</span>: </Label>
      </Item>}
      <Item
        name='emojiList'
        dataField='emojiList'
        editorType='dxSelectBox'
        editorOptions={{
          dataSource: EmojiArr,
          displayExpr: 'id',
          valueExpr: 'id',
          dropDownButtonTemplate: 'conditionalIcon',
          onSelectionChanged: (e) => {
            setSelectedIcon(e.selectedItem ? e.selectedItem.icon : '');
          }
        }}>
        <Template
          name="conditionalIcon"
          render={() => emojiSelectBox(selectedIcon)}
        />
        <Label>{localizedString.emojiList}: </Label>
      </Item>
      <Item
        name='applyCell'
        dataField='applyCell'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyCell}: </Label>
      </Item>
      <Item
        name='applyTotal'
        dataField='applyTotal'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyTotal}: </Label>
      </Item>
      <Item
        name='applyGrandTotal'
        dataField='applyGrandTotal'
        editorType='dxCheckBox'
        editorOptions={{
        }}>
        <Label>{localizedString.applyGrandTotal}: </Label>
      </Item>
    </Form>
  );
};
export default React.forwardRef(DataHighlightForm);
