import {styled} from 'styled-components';
import titleBreakLine from 'assets/image/component/title_break_line_1.png';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Title = styled.div`
  font: ${theme.font.loginTitle};
  letter-spacing: -1px;
  text-align: left;
  height: 44px;
  position: relative;
  line-height: 30px;

  &:after {
    content: url(${titleBreakLine});
    width:32px 
    height: 4px;
    position: absolute;
    left: 0px;
    top: 14px;
  }
`;

const TitleWithBreakLine = ({children}) => {
  return (
    <Title>
      {children}
    </Title>
  );
};
export default TitleWithBreakLine;
