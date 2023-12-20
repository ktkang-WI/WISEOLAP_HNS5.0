import {styled} from 'styled-components';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
// import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
// import {useEffect, useState} from 'react';
// import useModal from 'hooks/useModal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import FormatOptionForm from '../molecules/FormatOptionForm';
import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
// import {useState} from 'react';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  width: 100%;
  height: 100%;
`;
//   display: flex;

const NumberFormatModal = ({onSubmit, ...props}) => {
  const formatOptions = {
    formatType: 'Number',
    unit: 'Ones',
    suffixEnabled: false,
    suffix: {
      O: '',
      K: '천',
      M: '백만',
      B: '십억'
    },
    precision: 0,
    precisionType: '반올림',
    useDigitSeparator: true
  };

  return (
    <Modal
      onSubmit={()=> {
        return true;
      }}
      height={theme.size.numberFormatHeight}
      width={theme.size.numberFormatWidth}
      modalTitle={localizedString.numberFormat}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper>
          <FormatOptionForm
            formatOptions={formatOptions}
          />
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default NumberFormatModal;
