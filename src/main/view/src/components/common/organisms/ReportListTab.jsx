import {getTheme} from 'config/theme';
import {Lookup} from 'devextreme-react';
import {styled} from 'styled-components';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
  text-align: left;
`;

const ReportListTab = () => {
  return (
    <Wrapper>
      <Lookup></Lookup>
    </Wrapper>
  );
};

export default ReportListTab;
