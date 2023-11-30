import styled from 'styled-components';

const Wrap = styled.div`
  border: 2px solid #f5f6fa;
  & > div: hover {
    background-color: #f5f6fa
  }
  margin: 5px 0px 10px 10px;
`;

const IconWrap = ({children}) => {
  return (
    <Wrap>
      {children}
    </Wrap>
  );
};
export default IconWrap;
