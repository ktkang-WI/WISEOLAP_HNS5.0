import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';

const Panel = ({title, children, ...props}) => {
  return (
    <Wrapper
      overflow='hidden'
      display='flex'
      direction='column'
      {...props}
    >
      <Title title={title}></Title>
      <Wrapper height={'calc(100% - 40px)'}>
        {children}
      </Wrapper>
    </Wrapper>
  );
};

export default Panel;
