import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div `
  height: 100%;
  width: auto;
  position: relative;
  margin: 0px 3px;
  border-radius: 8px 8px 0px 0px;
  border: 1px solid ${theme.color.gray200};
  padding: 0px 20px;
  box-sizing: border-box;

  &.selected {
    border-bottom: none;
    background: ${theme.color.background};
  }
`;

const TitlePanel = styled.div`
  border-radius: 5px 5px 0 0;
  height: ${(props) => props.height};
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: start;
  align-items: center;
`;


const ReportTitlePanel = ({height='52px', children, selected}) => {
  return (
    <Wrapper className={selected? 'selected' : ''}>
      <TitlePanel height={height}>
        {children}
      </TitlePanel>
    </Wrapper>
  );
};

export default ReportTitlePanel;
