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
// flex: 1 1 auto; /* 자식 요소들이 컨테이너의 가용 공간을 채우도록 크기 조정 */
    min-width: 0; /* 필요할 경우 자식 요소의 크기를 줄이도록 설정 */
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


const ReportTitlePanel = ({height='52px', children, selected, title}) => {
  return (
    <Wrapper className={selected? 'selected' : ''} title={title}>
      <TitlePanel height={height}>
        {children}
      </TitlePanel>
    </Wrapper>
  );
};

export default ReportTitlePanel;
