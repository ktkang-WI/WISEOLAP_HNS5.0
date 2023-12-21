import styled from 'styled-components';
import TempSpread from './TempSpread';

const Wrapper = styled.div`
  height: '100%';
  width: '100%';
`;

// ribbon height = 147px
const Spreadsheet = () => {
  return (
    <Wrapper>
      <TempSpread />
    </Wrapper>
  );
};

export default Spreadsheet;
