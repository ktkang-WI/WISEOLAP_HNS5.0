import {styled} from 'styled-components';

const Wrapper = styled.div `
  height: 100%;
  width: 100%;
  position: relative;
  margin: 0px 3px;
  max-width: 256px;
`;

const TitlePanel = styled.div`
  border-radius: 5px 5px 0 0;
  height: ${(props) => props.height};
  width: 100%;
  position: absolute;
  bottom: 0;
  max-width: 250px;
  display: flex;
  justify-content: start;
  align-items: center;
`;


const ReportTitlePanel = ({height='35px', children}) => {
  return (
    <Wrapper>
      <TitlePanel height={height}>
        {children}
      </TitlePanel>
    </Wrapper>
  );
};

export default ReportTitlePanel;
