import styled from 'styled-components';

const StyledTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px;
  `;

const Title = ({title}) => {
  return (
    <StyledTitle>{title}</StyledTitle>
  );
};

export default Title;

