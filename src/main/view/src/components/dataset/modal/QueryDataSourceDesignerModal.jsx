import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DatasetName from '../atomic/molecules/DatasetName';
import localizedString from '../../../config/localization';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import models from 'models';
import useModal from 'hooks/useModal';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import QueryDataFieldList from '../atomic/molecules/QueryDataFieldList';
import EditParamterModal from './EditParamterModal';
import ParameterList from '../atomic/molecules/ParameterList';
import {selectCurrentParameters} from 'redux/selector/ParameterSelector';
import ParamUtils from '../utils/ParamUtils';
import ParameterSlice from 'redux/modules/ParameterSlice';

const theme = getTheme();

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  & + & {
    border-left: 1px solid ${theme.color.breakLine};
  }
`;
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, orgDataset={}, query='', ...props
}) => {
  // const isNew = _.isEmpty(dataset);
  const {openModal, alert} = useModal();
  const dispatch = useDispatch();
  const {insertDataset} = DatasetSlice.actions;
  const {setParameterInformation} = ParameterSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const datasets = useSelector(selectCurrentDatasets);
  const parameters = useSelector(selectCurrentParameters);
  const queryEditorRef = useRef();
  const editorRef = queryEditorRef.current;
  const [dataset, setDataset] = useState(orgDataset);
  const [paramInfo, setParamInfo] = useState(parameters.informations);
  let selectedParam = [];

  useEffect(() => {
    if (!_.isEmpty(dataset)) {
      // TODO: 기존 데이터 집합 수정하는 경우!!
    } else {
      setDataset({
        datasetNm: localizedString.defaultDatasetName,
        datasetType: 'DS_SQL',
        dataSrcId: selectedDataSource.dsId
      });
    }
  }, []);

  const generateParameter = {
    text: '생성',
    onClick: () => {
      const query = editorRef.editor.getValue();
      const paramNames = ParamUtils.getParameterNamesInQuery(query);
      let order = paramInfo.reduce((acc, param) => {
        if (acc <= param.order) {
          acc = param.order + 1;
        }
        return acc;
      }, 1);

      const tempParam = [];

      if (!paramNames) {
        setParamInfo(tempParam);
        return;
      }

      // TODO: 현재 데이터셋과 관련 없는 경우 tempParam에 추가되어야 함.
      paramNames.forEach((name) => {
        const p = paramInfo.find((param) => param.name == name);
        if (!p) {
          const newParam =
            ParamUtils.newParamInformation(
                name, dataset.dataSrcId, dataset.datasetType, order ++);
          tempParam.push(newParam);
        } else {
          tempParam.push(p);
        }
      });

      tempParam.sort((a, b) => a.order - b.order);

      setParamInfo(tempParam);
    }
  };

  const editParameter = {
    text: '편집',
    onClick: () => {
      openModal(EditParamterModal, {
        parameterInfo: paramInfo,
        onSubmit: (p) => {
          setParamInfo(p);
        }
      });
    }
  };

  const deleteParameter = {
    text: '삭제',
    onClick: () => {
      const tempParam = paramInfo.filter((param) => {
        const p = selectedParam.find((sel) => param.name == sel.name);
        return p ? false : true;
      });

      setParamInfo(tempParam);
    }
  };

  const paramterButtons = [generateParameter, editParameter, deleteParameter];

  return (
    <Modal
      onSubmit={async () => {
        const query = editorRef.editor.getValue();
        const dupleCheck =
          datasets.find((name) => name.datasetNm == dataset.datasetNm);

        if (!query || query == '') { // 쿼리 빈값 확인.
          alert('쿼리를 입력해 주세요.');
        } else if (!dataset.datasetNm || dataset.datasetNm == '') {
          alert('데이터 집합 명을 입력해 주세요.');
        } else if (dupleCheck) { // 데이터 집합 명 중복 검사.
          alert('중복된 데이터 집합 명입니다. 다시 입력해 주세요.');
        } else { // 백단에서 쿼리 검사 및 데이터 가져옴.
          const parameters = {
            informations: paramInfo,
            values: {}
          };

          const response = await models.DBInfo.
              getDataByQueryMart(selectedDataSource.dsId, query, parameters);
          if (!response.rowData[0].error) {
            let tempFields = response.metaData;

            tempFields = tempFields.map((field) => {
              const isMea = field.columnTypeName == 'decimal';
              return {
                icon: isMea ? meaImg : dimImg,
                parentId: '0',
                uniqueName: field.columnName,
                name: field.columnName,
                type: isMea ? 'MEA' : 'DIM',
                ...field
              };
            });

            tempFields.unshift({
              name: localizedString.defaultDatasetName,
              type: 'FLD',
              uniqueName: '0',
              icon: folderImg
            });

            dispatch(insertDataset({
              reportId: selectedReportId,
              dataset: {
                ...dataset,
                datasetQuery: query,
                fields: tempFields
              }
            }));

            dispatch(setParameterInformation({
              reportId: selectedReportId,
              informations: paramInfo
            }));

            return;
          } else {
            alert('쿼리가 부적절 합니다. 다시 입력해 주세요.');
          }
        }
        return true;
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.datasetDesigner}
      {...props}
    >
      <RowWrapper>
        <ColumnWrapper>
          <ModalPanel
            title={localizedString.dataSourceInfo}
            width='300px'
            height='250px'
            padding='10'>
            <DataSourceInfoForm
              compact={true}
              selectedDataSource={selectedDataSource}
            />
          </ModalPanel>
          <ModalPanel
            title={localizedString.dataItem}
            height='calc(100% - 250px)'
            width='300px'
            padding='10'>
            <QueryDataFieldList dataSource={selectedDataSource}/>
          </ModalPanel>
        </ColumnWrapper>
        <ColumnWrapper>
          <DatasetName
            name={dataset.datasetNm || ''}
            onValueChanged={(datasetNm) => {
              setDataset({...dataset, datasetNm});
            }}
          />
          <ModalPanel title={localizedString.query} height='100%' padding='10'>
            <QueryEditor
              editorRef={queryEditorRef}
              value={editorRef && editorRef.editor.getValue()}/>
          </ModalPanel>
          <ModalPanel
            title={localizedString.parameter}
            headerButtons={paramterButtons}
            height='300px'
            padding='10'>
            <ParameterList
              height='200px'
              // TODO: 해당 부분 추후 데이터 집합 수정 추가시 dataset에 해당하는 param만 보이게 필터 걸어야함.
              dataSource={paramInfo}
              selection={{mode: 'multiple'}}
              onSelectionChanged={(e) => {
                selectedParam = e.selectedRowsData;
              }}
            />
          </ModalPanel>
        </ColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default QueryDataSourceDesignerModal;
