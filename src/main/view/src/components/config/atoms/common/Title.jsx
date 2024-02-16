import styled from 'styled-components';

const StyledTitle = styled.div`
    font-size: 1rem;
    font-weight: 900;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 10px;
    color:#577DF6;
  `;

const Title = ({title}) => {
  return (
    <StyledTitle>{title}</StyledTitle>
  );
};

export default Title;

