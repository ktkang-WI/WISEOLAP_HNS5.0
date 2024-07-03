import styled from 'styled-components';

const StyledTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px;
  `;

const Title = ({children, title}) => {
  return (
    <StyledTitle>{title}{children}</StyledTitle>
  );
};

export default Title;

