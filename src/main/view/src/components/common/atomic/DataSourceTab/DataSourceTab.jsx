import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import localizedString from '../../../../config/localization';
import PanelTitle from '../Common/Panel/PanelTitle';
import DataSourceFoldableList from './molecules/DataSourceFoldableList';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentDataset, selectCurrentDatasets}
  from 'redux/selector/DatasetSelector';
import DatasetSlice from 'redux/modules/DatasetSlice';
import _ from 'lodash';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useCallback} from 'react';
import {
  selectCurrentDesignerMode,
  selectEditMode
} from 'redux/selector/ConfigSelector';
import {DesignerMode, EditMode} from 'components/config/configType';
import DatasetType from 'components/dataset/utils/DatasetType';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-radius: 10px;
  border: solid 1px ${theme.color.breakLine};
  text-align: left;
  ${(props) => props.designerMode == DesignerMode.EXCEL ?
    'border-radius: 10px;' :
    `border-radius: 10px 0px 0px 10px;
    border-right: none;
    `}
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;

  & .dx-selectbox.dx-editor-outlined {
    border-radius: 0px;
    border: none;
    border-bottom: 1px solid ${theme.color.gray200};
    transition: border 0.5s ease;
  }

  & .dx-selectbox.dx-editor-outlined.dx-dropdowneditor-active {
    border-radius: 0px;
    border: none;
    border-bottom: 1px solid ${theme.color.primary};
  }

  & .dx-dropdowneditor-button, & .dx-button-content, & .dx-dropdowneditor-icon {
    background: none !important;
    box-shadow: none !important;
  }
`;

const DataSourceTab = () => {
  const reportId = useSelector(selectCurrentReportId);
  const datasets = useSelector(selectCurrentDatasets);
  const selectedDataset = useSelector(selectCurrentDataset);
  const designerMode = useSelector(selectCurrentDesignerMode);
  const editMode = useSelector(selectEditMode);

  const dispatch = useDispatch();
  const {selectDataset} = DatasetSlice.actions;

  const onValueChanged = useCallback((e) => {
    dispatch(selectDataset({
      reportId: reportId,
      datasetId: e.value? e.value.datasetId : ''
    }));
  }, [selectedDataset]);

  const buttons = [
    'ViewerPostingData',
    'CustomField',
    'DataSourceModify',
    'DataSourceRemove'
  ];

  if (editMode == EditMode['VIEWER'] || designerMode == DesignerMode['EXCEL']) {
    // buttons 배열 맨 처음에 값이 추가 될 가능성이 있어 shift() 함수로 제거는 위험.
    const unnecessaryBtns = ['ViewerPostingData', 'CustomField'];

    for (let i = 0; i < buttons.length; i++) {
      if (unnecessaryBtns.includes(buttons[i])) {
        buttons.splice(i, 1);
        i--;
      }
    }
  }

  if (selectedDataset?.datasetType == DatasetType.DS_SQL) {
    buttons.unshift('FieldDescription');
  }

  if (selectedDataset?.datasetType == DatasetType.CUBE) {
    buttons.unshift('ShowHiddenFields');
  }

  return (
    <Wrapper designerMode={designerMode}>
      <PanelTitle
        panelTitle={localizedString.dataSource}
        buttons={buttons}
      />
      <ContentWrapper>
        <SelectBox
          style={{marginBottom: '10px'}}
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default DataSourceTab;
