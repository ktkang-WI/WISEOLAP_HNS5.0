import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  border-bottom: solid 1px ${theme.color.breakLine};
`;

const PageWrapper = ({children}) => {
  return (
    <StyledWrapper className='modal-page'>
      {children}
    </StyledWrapper>
  );
};

export default PageWrapper;
