/* eslint-disable max-len */
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import QueryEditor from '../atomic/molecules/QueryEditor';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import DatasetName from '../atomic/molecules/DatasetName';
import localizedString from '../../../config/localization';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import models from 'models';
import useModal from 'hooks/useModal';
import {selectCurrentDatasets, selectDatasetQuantity}
  from 'redux/selector/DatasetSelector';
import QueryDataFieldList from '../atomic/molecules/QueryDataFieldList';
import EditParamterModal from './EditParamterModal';
import ParameterList from '../atomic/molecules/ParameterList';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import ParamUtils from '../utils/ParamUtils';
import ParameterSlice from 'redux/modules/ParameterSlice';
import DatasetType from '../utils/DatasetType';
import {makeFieldIcon} from '../utils/DatasetUtil';
import ViewQuery from '../atomic/molecules/ViewQuery';

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
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  justify-content: ${(props) => props.justifyContent};
  align-items:${(props) => props.alignItems};
  border-radius: ${(props) => props.borderRadius};
  border: ${(props) => props.border};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
`;

const QueryDataSourceDesignerModal = ({
  onSubmit, selectedDataSource, orgDataset, query='', onClose, ...props
}) => {
  const defaultDataset = {
    datasetNm: localizedString.defaultDatasetName,
    datasetType: DatasetType.DS_SQL,
    dataSrcId: selectedDataSource.dsId,
    datasetQuery: ''
  };

  // hook
  const {openModal, alert, confirm, detailMsgAlert} = useModal();
  const dispatch = useDispatch();

  // actions
  const {updateDataset} = DatasetSlice.actions;
  const {updateParameterInformation} = ParameterSlice.actions;

  // selector
  const selectedReportId = useSelector(selectCurrentReportId);
  const datasets = useSelector(selectCurrentDatasets);
  const parameters = useSelector(selectRootParameter);
  const datasetQuantity = useSelector(selectDatasetQuantity);

  // local
  const datasetId = orgDataset ?
    orgDataset.datasetId : 'dataset' + (datasetQuantity + 1);
  let selectedParam = [];

  // state
  const queryEditorRef = useRef();
  const [dataset, setDataset] =
      useState(_.cloneDeep(orgDataset || defaultDataset));
  const [paramInfo, setParamInfo] = useState(parameters.informations
      .filter((i) => i.dataset.includes(datasetId)));

  useEffect(() => {
    if (!_.isEmpty(queryEditorRef.current)) {
      queryEditorRef.current.editor.setValue(dataset.datasetQuery);
    }
  }, [queryEditorRef]);

  const generateParameter = {
    text: '생성',
    onClick: () => {
      const excludedString = /[-\+!~`#$%^&*<>\{\}\:]/g;
      const query = queryEditorRef.current.editor.getValue();
      const paramNames = ParamUtils.getParameterNamesInQuery(query) || [];

      for (const param of paramNames) {
        const matchResult = param.match(excludedString);

        if (matchResult) {
          alert('매개변수 생성에 해당 특수문자('+ matchResult.toString() +')를 넣으실수 없습니다.\n' +
            '\n사용 불가 특수문자 목록\n :-+!~`#$%^&*<>{}'
          );
          return;
        }
      }

      // 기존 데이터 필터링
      const newParamInfo = paramInfo.filter((info) => {
        const idx = paramNames.indexOf(info.name);
        // 기존에 있던 필터
        if (idx >= 0) {
          paramNames.splice(idx, 1);
          return true;
        }
        return false;
      });

      let order = newParamInfo.reduce((acc, param) => {
        if (acc <= param.order) {
          acc = param.order + 1;
        }
        return acc;
      }, 1);

      // 기존에 없던 필터
      for (name of paramNames) {
        const org = parameters.informations.find((info) => info.name == name);
        if (org) {
          // 다른 데이터 집합에 동일한 이름을 가진 필터가 있는 경우우
          newParamInfo.push({...org, dataset: org.dataset.concat([datasetId])});
        } else {
          const newParam =
            ParamUtils.newParamInformation(
                name, dataset.dataSrcId, dataset.datasetType, order ++);

          newParam.dataset = [datasetId];
          newParamInfo.push(newParam);
        }
      }

      newParamInfo.sort((a, b) => a.order - b.order);

      setParamInfo(newParamInfo);
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
      onSubmit={() => {
        const query = queryEditorRef.current.editor.getValue();
        const dupleCheck = datasets.find((ds) =>
          ds.datasetNm == dataset.datasetNm && ds.datasetId != datasetId);

        const setDataset = async () => {
          const parameters = {
            informations: paramInfo,
            values: {}
          };

          const response = await models.DBInfo.
              getDataByQueryMart(selectedDataSource.dsId, query, parameters);
          if (response.message === 'canceled') return;
          if (!response.data.rowData[0]?.error) {
            let tempFields = response.data.metaData;
            tempFields = makeFieldIcon(tempFields, dataset.datasetNm);
            if (dataset?.customDatas?.customData) {
              tempFields = [...tempFields, ...dataset.customDatas.customData];
            }

            const orgFieldDesc = dataset.fieldDescription || {};
            const tempFieldDesc = {};

            // 지워진 필드의 필드 설명 지우기
            for (const field of tempFields) {
              if (orgFieldDesc[field.name]) {
                tempFieldDesc[field.name] = orgFieldDesc[field.name];
              }
            }

            dispatch(updateDataset({
              reportId: selectedReportId,
              dataset: {
                ...dataset,
                datasetId: datasetId,
                datasetQuery: query,
                fields: tempFields,
                fieldDescription: tempFieldDesc
              }
            }));

            dispatch(updateParameterInformation({
              datasetId: datasetId,
              reportId: selectedReportId,
              informations: paramInfo
            }));

            onClose();
          } else {
            detailMsgAlert(localizedString.invalidQuery, response.data.rowData[0]?.error);
          }
        };

        if (!query || query == '') { // 쿼리 빈값 확인.
          alert('쿼리를 입력해 주세요.');
        } else if (!dataset.datasetNm || dataset.datasetNm == '') {
          alert('데이터 집합 명을 입력해 주세요.');
        } else if (dupleCheck) { // 데이터 집합 명 중복 검사.
          alert('중복된 데이터 집합 명입니다. 다시 입력해 주세요.');
        } else if (!query.toLowerCase().includes('group by')) {
          confirm(localizedString.cofirmGroupBy, () => {
            setDataset();
          });
        } else { // 백단에서 쿼리 검사 및 데이터 가져옴.
          setDataset();
        }
        return true;
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.datasetDesigner}
      onClose={onClose}
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
          <RowWrapper
            height={'40px'}
            width={'97%'}
            justifyContent={'space-between'}
            alignItems={'center'}
            borderRadius={'10px'}
            border={'1px solid #D4D7DC'}
            padding={'0px 5px'}
            margin={'0px 5px'}
          >
            <DatasetName
              name={dataset.datasetNm || ''}
              onValueChanged={(datasetNm) => {
                setDataset({...dataset, datasetNm});
              }}
            />
            <ViewQuery
              dsId={selectedDataSource.dsId}
              paramInfo={paramInfo}
              queryEditorRef={queryEditorRef}
            />
          </RowWrapper>
          <ModalPanel title={localizedString.query} height='100%' padding='10'>
            <QueryEditor
              editorRef={queryEditorRef}
              value={queryEditorRef.current &&
                queryEditorRef.current.editor.getValue()}/>
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

export default React.memo(QueryDataSourceDesignerModal);
