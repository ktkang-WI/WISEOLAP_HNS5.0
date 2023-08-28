import {getTheme} from '../../../config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ReportTitleText = styled.div`
  color: ${theme.color.primaryFont};
  font: ${theme.font.reportTitle};
  padding-left: 20px;
  cursor: pointer;
`;

export default ReportTitleText;
