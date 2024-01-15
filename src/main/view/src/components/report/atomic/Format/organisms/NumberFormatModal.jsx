import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import localizedString from 'config/localization';
import {useRef} from 'react';
import {styled} from 'styled-components';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import FormatOptionForm from '../molecules/FormatOptionForm';

const NumberFormatModal = ({
  dataField, reportId, ...props}) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const {updateItemField} = ItemSlice.actions;
  const format = dataField.format;
  const formRef = useRef();
  const formData ={
    ...format,
    suffixO: format.suffix.O || '',
    suffixK: format.suffix.K || '천',
    suffixM: format.suffix.M || '백만',
    suffixB: format.suffix.B || '십억',
    checkBoxValue: format.suffixEnabled,
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
  };
  const StyledWrapper = styled(Wrapper)`
  width: 100%;
  height: 100%;
  `;
  return (
    <Modal
      onSubmit={()=> {
        dispatch(updateItemField({reportId,
          dataField: {...dataField, format: formData}}));
      }}
      height={theme.size.numberFormatHeight}
      width={theme.size.numberFormatWidth}
      modalTitle={localizedString.numberFormat}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper>
          <FormatOptionForm
            formData={formData}
            formRef={formRef}
          />
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default NumberFormatModal;
