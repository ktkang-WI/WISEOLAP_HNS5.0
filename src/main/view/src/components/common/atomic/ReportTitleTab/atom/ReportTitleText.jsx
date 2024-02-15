import {getTheme} from '../../../../../config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ReportTitleText = styled.div`
  color: ${theme.color.gray600};
  font: ${(props) => props.font || theme.font.reportTitle};
  padding-left: 20px;
  cursor: pointer;
`;

export default ReportTitleText;
