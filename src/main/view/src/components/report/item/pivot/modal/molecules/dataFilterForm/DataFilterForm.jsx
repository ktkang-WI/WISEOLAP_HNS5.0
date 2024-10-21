import {Form} from 'devextreme-react';
import {Item, Label} from 'devextreme-react/form';
import localizedString from '../../../../../../../config/localization';
import React, {useContext} from 'react';
import _ from 'lodash';
import useModal from 'hooks/useModal';
import {dataFilterFormContext}
  from '../../organism/dataFiltering/DataFilterModal';

const DataFilterForm = () => {
  const {alert} = useModal();

  const {
    formData,
    measureNames,
    showField,
    setShowField,
    highlightList,
    setHighlightList,
    ref
  } = useContext(dataFilterFormContext);

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

        // const findIdx = copyHighlight?.findIndex(
        //     (data) => (data.dataItem === formData.dataItem &&
        //     data.condition === formData.condition)
        // );
        // 데이터항목, 조건 유형, 조건 값이 아닌 값 변경 시
        // let isOtherChange = true;
        // if (findIdx != -1) {
        //   const dataFieldList = ['dataItem', 'condition', 'valueFrom'];
        //   if (dataFieldList.includes(e.dataField)) {
        //     if (copyHighlight[findIdx][e.dataField] == e.value) {
        //       isOtherChange = false;
        //     }
        //   }
        // }

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
          }
        }
      }}
    >
      <Item
        name='type'
        dataField='type'
        editorType='dxTextBox'
        editorOptions={{
          value: '측정값',
          readOnly: true
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
          items: [
            '=',
            '<>',
            '>',
            '>=',
            '<',
            '<=',
            'Between',
            '!=',
            'IS NOT NULL',
            'IN',
            'NOT IN'
          ]
        }}>
        <Label>{localizedString.conditionType}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      <Item
        name='valueFrom'
        dataField='valueFrom'
        editorType='dxNumberBox'
      >
        <Label>{localizedString.valueFrom}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      {showField && <Item // show in Between.
        name='valueTo'
        dataField='valueTo'
        editorType='dxNumberBox'
      >
        <Label>{localizedString.valueTo}
          <span className='requireRule'> *</span>: </Label>
      </Item>}
    </Form>
  );
};
export default React.forwardRef(DataFilterForm);
