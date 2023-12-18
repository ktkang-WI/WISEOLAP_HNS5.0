import styled from 'styled-components';

const Content = styled.div`
  display: ${(props)=> props.type === 'labelImages' ? 'flex' : 'block'};
`;

const InnerContentWrapper = ({children, type}) => {
  return (
    <Content type={type}>
      {children}
    </Content>
  );
};
export default InnerContentWrapper;
