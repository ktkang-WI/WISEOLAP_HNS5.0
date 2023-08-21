import {getTheme} from '../../../config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

const ReportTitleText = styled.div`
  color: ${theme.color.secondaryFont};
  padding: 10px 20px;
`;

export default ReportTitleText;
