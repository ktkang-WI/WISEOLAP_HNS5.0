import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {Lookup} from 'devextreme-react';
import localizedString from '../../../../config/localization';
import PanelTitle from '../Common/Panel/PanelTitle';
import DataSourceFoldableList from './molecules/DataSourceFoldableList';
import {useSelector} from 'react-redux';
import {selectCurrentReportDatasets} from 'redux/selector/ReportSelector';
import {useEffect, useRef, useState} from 'react';
import _ from 'lodash';

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
  const datasets = useSelector(selectCurrentReportDatasets);
  const [selectedDataset, setSelectedDataset] = useState({});
  const lookup = useRef();

  useEffect(() => {
    if (datasets.length == 1) {
      console.log(lookup.current);
    }
  }, datasets);
  return (
    <Wrapper>
      <PanelTitle
        panelTitle={localizedString.dataSource}
        buttons={['CustomField', 'DataSourceModify', 'DataSourceRemove']}
      />
      <Lookup
        dropDownOptions={{
          showCloseButton: false,
          showTitle: false
        }}
        ref={lookup}
        defaultValue={datasets.length > 0 ? _.defaultsDeep(datasets[0]) : {}}
        dataSource={datasets}
        displayExpr='datasetNm'
        searchEnabled={false}
        onValueChanged={(e) => {
          console.log(e.value);
          setSelectedDataset(e.value);
        }}
      />
      {!_.isEmpty(selectedDataset) &&
        <DataSourceFoldableList dataset={selectedDataset}/>
      }
    </Wrapper>
  );
};

export default DataSourceTab;
