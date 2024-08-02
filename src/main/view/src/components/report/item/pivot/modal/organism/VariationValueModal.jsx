import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {getTheme} from 'config/theme';
import VariationValueGrid
  from '../molecules/variationValueModal/VariationValueGrid';
import VariationValueForm
  from '../molecules/variationValueModal/VariationValueForm';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentAdHocOption, selectCurrentDataField}
  from 'redux/selector/ItemSelector';
import {useRef, useState} from 'react';
import _ from 'lodash';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import localizedString from 'config/localization';

const theme = getTheme();

const ID_STR = 'VARIATION_VALUE_';

const VariationValueModal = ({...props}) => {
  const adhocOption = useSelector(selectCurrentAdHocOption);
  const dataFields = useSelector(selectCurrentDataField);
  const reportId = useSelector(selectCurrentReportId);

  const [variationValues, setVariationValues] = useState(
      _.cloneDeep(adhocOption?.variationValues || []));
  const [selectedItem, setSelectedItem] = useState({});

  const formRef = useRef();
  const gridRef = useRef();
  const alertRef = useRef();

  const dispatch = useDispatch();

  const {updateVariationValues} = ItemSlice.actions;

  const btnStyle = {
    width: 'auto',
    padding: '10px'
  };

  const newBtn = {
    ...btnStyle,
    text: localizedString.new,
    onClick: () => {
      setSelectedItem({});
      alertRef.current.textContent = '';
    }
  };

  const saveBtn = {
    ...btnStyle,
    text: localizedString.save,
    onClick: () => {
      const res = formRef.current.instance.validate();
      alertRef.current.textContent = '';
      if (!res.isValid) {
        return;
      }

      let id = selectedItem.id;
      // 아이디가 없는 경우 새 아이템
      if (!id) {
        id = ID_STR + 1;

        if (variationValues.length > 0) {
          const num = Number(variationValues[variationValues.length - 1].id.
              replace(ID_STR, '')) + 1;
          id = ID_STR + num;
        }

        const newSelectedItem = {
          id: id,
          ...selectedItem
        };

        setVariationValues([...variationValues, newSelectedItem]);
        setSelectedItem({});
        return;
      }

      const newVariationValues = variationValues.reduce((acc, v) => {
        if (v.id != id) {
          acc.push(v);
        } else {
          acc.push(selectedItem);
        }

        return acc;
      }, []);

      setVariationValues(newVariationValues);
    }
  };

  const onFieldDataChanged = ({dataField, value}) => {
    if (dataField == 'targetId') {
      const mea = dataFields.measure
          // TODO: 추후 pivotMatrix 개선 후 적용
          // .concat(dataFields.sortByItem)
          .find((mea) => mea.fieldId == value);

      setSelectedItem({
        ...selectedItem,
        targetName: mea.caption,
        [dataField]: value
      });

      return;
    }

    setSelectedItem({
      ...selectedItem,
      [dataField]: value
    });
  };

  const onSelectionChanged = (e) => {
    if (e.selectedRowsData.length == 0) {
      setSelectedItem({});
    } else {
      setSelectedItem(e.selectedRowsData[0]);
    }
  };

  const onSubmit = () => {
    dispatch(updateVariationValues({
      reportId,
      variationValues
    }));
  };

  return (
    <Modal
      width={theme.size.bigModalWidth}
      height={theme.size.middleModalHeight}
      modalTitle={localizedString.variationValue}
      onSubmit={onSubmit}
      {...props}
    >
      <Wrapper
        direction={'row'}
        display={'flex'}
      >
        <ModalPanel
          title={localizedString.variationValueList}
        >
          <VariationValueGrid
            onSelectionChanged={onSelectionChanged}
            gridRef={gridRef}
            dataSource={variationValues}
          />
        </ModalPanel>
        <ModalPanel
          headerButtons={[
            newBtn,
            saveBtn
          ]}
          title={localizedString.variationValueInfo}
        >
          <VariationValueForm
            formData={selectedItem}
            onFieldDataChanged={onFieldDataChanged}
            formRef={formRef}
            alertRef={alertRef}
          />
        </ModalPanel>
      </Wrapper>
    </Modal>
  );
};

export default VariationValueModal;
