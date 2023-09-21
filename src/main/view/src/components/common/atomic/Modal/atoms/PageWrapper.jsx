import Wrapper from 'components/common/atoms/Wrapper';

const PageWrapper = ({children}) => {
  return (
    <Wrapper className='modal-page'>
      {children}
    </Wrapper>
  );
};

export default PageWrapper;
