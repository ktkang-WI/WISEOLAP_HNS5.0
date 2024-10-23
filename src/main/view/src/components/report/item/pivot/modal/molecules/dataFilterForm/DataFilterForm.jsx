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
    ref,
    setData,
    showField,
    measureNames,
    dataFiltering,
    setDataFilteringList,
    setShowField,
    formData
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
        const copyDataFilterInfo = _.cloneDeep(dataFiltering);

        const findIdx = copyDataFilterInfo?.findIndex(
            (data) => (data.dataItem === formData.dataItem &&
            data.condition === formData.condition)
        );
        // 데이터항목, 조건 유형, 조건 값이 아닌 값 변경 시
        let isOtherChange = true;
        if (findIdx != -1) {
          const dataFieldList = ['dataItem', 'condition', 'valueFrom'];
          if (dataFieldList.includes(e.dataField)) {
            if (copyDataFilterInfo[findIdx][e.dataField] == e.value) {
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
            copyDataFilterInfo[formData.rowIdx] = formData;
            setDataFilteringList(copyDataFilterInfo);
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
          value: formData.type || 'measure',
          valueExpr: 'name',
          displayExpr: 'caption',
          readOnly: true,
          disabled: formData.dataItem ?? false
        }}>
        <Label>{localizedString.dataItemType}</Label>
      </Item>
      <Item
        name='dataItem'
        dataField='dataItem'
        editorType='dxSelectBox'
        editorOptions={{
          placeholder: '항목을 선택해주세요.',
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
          placeholder: '조건을 선택해주세요.',
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
        editorOptions={{
          placeholder: '수치를 입력해주세요.',
          value: formData.valueFrom || ''
        }}
      >
        <Label>{localizedString.valueFrom}
          <span className='requireRule'> *</span>: </Label>
      </Item>
      {showField && <Item // show in Between.
        name='valueTo'
        dataField='valueTo'
        editorType='dxNumberBox'
        editorOptions={{
          placeholder: '수치를 입력해주세요.',
          value: formData.valueFrom || ''
        }}
      >
        <Label>{localizedString.valueTo}
          <span className='requireRule'> *</span>: </Label>
      </Item>}
    </Form>
  );
};
export default React.forwardRef(DataFilterForm);
