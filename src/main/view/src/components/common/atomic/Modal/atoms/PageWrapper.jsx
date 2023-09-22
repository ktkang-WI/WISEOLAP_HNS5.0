import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const PageWrapper = ({children}) => {
  return (
    <Wrapper className='modal-page'>
      {children}
    </Wrapper>
  );
};

export default PageWrapper;
