import {getTheme} from '../../../../../config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ReportTitleText = styled.div`
  color: ${(props) => props.selected ?
    theme.color.gray600 : theme.color.gray400};
  font: ${(props) => props.font || theme.font.reportTitle};
  font-weight: ${(props) => props.selected ?
   '500' : '400'};
  cursor: pointer;
  text-wrap: nowrap;
  user-select: text;
`;

export default ReportTitleText;
