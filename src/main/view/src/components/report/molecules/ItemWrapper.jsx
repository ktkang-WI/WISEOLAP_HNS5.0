import {styled} from 'styled-components';

const StyledWarpper = styled.div`
  height: 96%;
  width: 100%;
  display: flex;
  flex: 1;
  border: 2px solid green;
`;

const ItemWrapper = () => {
  return (
    <StyledWarpper>
    </StyledWarpper>
  );
};

export default ItemWrapper;
