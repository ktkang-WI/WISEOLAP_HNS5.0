import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import localizedString from 'config/localization';
import {useRef} from 'react';
import {styled} from 'styled-components';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import FormatOptionForm from '../molecules/FormatOptionForm';

const StyledWrapper = styled(Wrapper)`
width: 100%;
height: 100%;
`;

const NumberFormatModal = ({
  dataField, reportId, ...props}) => {
  const dispatch = useDispatch();
  const formRef = useRef();
  const {updateItemField} = ItemSlice.actions;
  const format = dataField.format;
  const formData ={
    ...format,
    suffix: {
      O: format.suffixO,
      K: format.suffixK,
      M: format.suffixM,
      B: format.suffixB
    },
    suffixO: format.suffixO || '',
    suffixK: format.suffixK || localizedString.k,
    suffixM: format.suffixM || localizedString.m,
    suffixB: format.suffixB || localizedString.b
  };

  return (
    <Modal
      onSubmit={()=> {
        dispatch(updateItemField({reportId,
          dataField: {...dataField, format: formData}}));
      }}
      height="700px"
      width="420px"
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
