import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {Lookup} from 'devextreme-react';
import localizedString from '../../../../config/localization';
import PanelTitle from '../Common/Panel/PanelTitle';
import DataSourceFoldableList from './molecules/DataSourceFoldableList';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {selectCurrentDataset, selectCurrentDatasets}
  from 'redux/selector/DatasetSelector';
import DatasetSlice from 'redux/modules/DatasetSlice';
import _ from 'lodash';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useCallback} from 'react';

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
  const datasets = useSelector(selectCurrentDatasets);
  const selectedDataset = useSelector(selectCurrentDataset);
  const selectedReportId = useSelector(selectCurrentReportId, shallowEqual);
  const dispatch = useDispatch();
  const {selectDataset} = DatasetSlice.actions;

  const onValueChanged = useCallback((e) => {
    dispatch(selectDataset({
      reportId: selectedReportId,
      datasetId: e.value? e.value.datasetId : ''
    }));
  }, [selectedDataset]);

  return (
    <Wrapper>
      <PanelTitle
        panelTitle={localizedString.dataSource}
        buttons={['CustomField', 'DataSourceModify', 'DataSourceRemove']}
      />
      <Lookup
        dropDownOptions={{
          showCloseButton: false,
          showTitle: false,
          hideOnOutsideClick: true
        }}
        placeholder='데이터 집합 선택'
        showCancelButton={false}
        defaultValue={selectedDataset}
        value={selectedDataset}
        dataSource={datasets}
        displayExpr='datasetNm'
        searchEnabled={false}
        onValueChanged={onValueChanged}
      />
      {!_.isEmpty(selectedDataset) &&
        <DataSourceFoldableList dataset={selectedDataset}/>
      }
    </Wrapper>
  );
};

export default DataSourceTab;
