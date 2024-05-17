import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';

const Title = styled.div`
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 10px;
  color:#577DF6;
`;

const Container = styled.div`
  padding: 20px;
`;

const Panel = ({title, children}) => {
  return (
    <Container>
      <Wrapper
        display='flex'
        direction='column'>
        <Wrapper size="50px">
          <Title>{title}</Title>
        </Wrapper>
        <Wrapper size="50px">
          {children}
        </Wrapper>
      </Wrapper>
    </Container>
  );
};

export default Panel;
