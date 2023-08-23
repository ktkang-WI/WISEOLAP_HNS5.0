import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {Lookup} from 'devextreme-react';
import localizedString from '../../../config/localization';
import PanelTitle from '../molecules/PanelTitle';
import DataSourceFoldableList from '../molecules/DataSourceFoldableList';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
  text-align: left;
`;

const DataSourceTab = () => {
  return (
    <Wrapper>
      <PanelTitle
        panelTitle={localizedString.dataSource}
        buttons={['CustomField', 'DataSourceModify', 'DataSourceRemove']}
      />
      <Lookup></Lookup>
      <DataSourceFoldableList></DataSourceFoldableList>
    </Wrapper>
  );
};

export default DataSourceTab;
