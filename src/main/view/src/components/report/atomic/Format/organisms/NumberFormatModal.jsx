import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import localizedString from 'config/localization';
import {useState, useEffect} from 'react';
import {styled} from 'styled-components';
import NumberFormatUtility from 'components/utils/NumberFormatUtility';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import FormatOptionForm from '../molecules/FormatOptionForm';

const NumberFormatModal = ({
  dataField, reportId, ...props}) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const {updateItemField} = ItemSlice.actions;
  const FormatState = dataField.format;
  const formatValue = (options) => {
    const value = 1234567890.123;
    const formatted = NumberFormatUtility.formatNumber(
        value,
        options.formatType,
        options.unit,
        options.precision,
        options.useDigitSeparator,
        undefined,
        options.suffix,
        options.suffixEnabled,
        options.precisionType
    );
    return formatted;
  };

  const [state, setState] = useState({
    ...FormatState,
    suffixO: FormatState.suffix.O || '',
    suffixK: FormatState.suffix.K || '천',
    suffixM: FormatState.suffix.M || '백만',
    suffixB: FormatState.suffix.B || '십억',
    formattedValue: formatValue(FormatState),
    checkBoxValue: FormatState.suffixEnabled,
    formControls: {
      unit: false,
      suffixEnabled: false,
      suffixO: false,
      suffixK: false,
      suffixM: false,
      suffixB: false,
      precision: false,
      precisionType: false,
      useDigitSeparator: false
    }
  });
  const updateFormControls = () => {
    const isAutoOrGeneral =
    state.formatType === 'Auto' || state.formatType === 'General';
    const isNumberOrCurrency =
    state.formatType === 'Number' || state.formatType === 'Currency';
    const isScientificOrPercent =
    state.formatType === 'Scientific' || state.formatType === 'Percent';
    let isSuffixEnabled = state.suffixEnabled;
    let isCheckBoxValue = state.checkBoxValue;
    if (isAutoOrGeneral || isScientificOrPercent) {
      isSuffixEnabled = false;
      isCheckBoxValue = false;
    }
    console.log('isSuffixEnabled', isSuffixEnabled);
    console.log('isCheckBoxValue', isCheckBoxValue);
    console.log('confirm', !(isSuffixEnabled && isCheckBoxValue));
    const updatedControls = {
      unit: !isNumberOrCurrency,
      suffixEnabled: !isNumberOrCurrency,
      suffixO: !(isSuffixEnabled && isCheckBoxValue),
      suffixK: !(isSuffixEnabled && isCheckBoxValue),
      suffixM: !(isSuffixEnabled && isCheckBoxValue),
      suffixB: !(isSuffixEnabled && isCheckBoxValue),
      precision: !isScientificOrPercent && !isNumberOrCurrency,
      precisionType: !isScientificOrPercent && !isNumberOrCurrency,
      useDigitSeparator: isAutoOrGeneral || isScientificOrPercent
    };
    setState((prevState) => ({
      ...prevState,
      formControls: updatedControls
    }));
  };

  useEffect(() => {
    updateFormControls();
    const newFormatState = {
      formatType: state.formatType,
      unit: state.unit,
      precision: state.precision,
      precisionType: state.precisionType,
      useDigitSeparator: state.useDigitSeparator,
      undefined,
      suffix: {
        O: state.suffixO,
        K: state.suffixK,
        M: state.suffixM,
        B: state.suffixB
      },
      suffixEnabled: state.suffixEnabled
    };
    const newValue = formatValue(newFormatState);
    setState((prevState) => ({
      ...prevState,
      formattedValue: newValue,
      FormatState: newFormatState
    }));
  }, [
    state.formatType,
    state.suffixEnabled,
    state.checkBoxValue,
    state.unit,
    state.suffixO,
    state.suffixK,
    state.suffixM,
    state.suffixB,
    state.precision,
    state.precisionType,
    state.useDigitSeparator
  ]);
  const handleCheckBoxValueChanged = (name, value) => {
    if (name === 'suffixEnabled') {
      setState((prevState) => ({
        ...prevState,
        suffixEnabled: value,
        checkBoxValue: value
      }));
    }
  };

  const StyledWrapper = styled(Wrapper)`
  width: 100%;
  height: 100%;
  `;

  return (
    <Modal
      onSubmit={()=> {
        dispatch(updateItemField({reportId,
          dataField: {...dataField, format: state.FormatState}}));
      }}
      height={theme.size.numberFormatHeight}
      width={theme.size.numberFormatWidth}
      modalTitle={localizedString.numberFormat}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper>
          <FormatOptionForm
            state={state}
            setState={setState}
            handleCheckBoxValueChanged={handleCheckBoxValueChanged}
          />
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default NumberFormatModal;
