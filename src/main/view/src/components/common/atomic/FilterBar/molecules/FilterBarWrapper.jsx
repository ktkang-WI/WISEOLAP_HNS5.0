import {Droppable} from 'react-beautiful-dnd';
import localizedString from 'config/localization';
import Filter from './Filter';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {useSelector, useDispatch} from 'react-redux';
import {
  useEffect
} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import _ from 'lodash';
import useModal from 'hooks/useModal';
import LoadingSlice from 'redux/modules/LoadingSlice';
import {
  // selectNewLinkParamInfo,
  selectNewLinkCnt
} from 'redux/selector/LinkSelector';
import LinkSlice from 'redux/modules/LinkSlice';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import DatasetSlice from 'redux/modules/DatasetSlice';

const theme = getTheme();

const StyledFilterBarWrapper = styled.div`
    height: 100%;
    min-height: ${theme.size.filterBarHeight};
    line-height: ${theme.size.filterBarHeight};
    width: 100%;
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    text-align: left;
  `;

const FilterBarWrapper = (props) => {
  const parameters = useSelector(selectRootParameter);
  const reportId = selectCurrentReportId(store.getState());
  const selectedDataset = selectCurrentDataset(store.getState());
  const {executeParameters, executeLinkageFilter} = useQueryExecute();
  const {setParameterValues, deleteParameter} = ParameterSlice.actions;
  const {updateDataset} = DatasetSlice.actions;
  const {startJob, endJob} = LoadingSlice.actions;
  const {confirm} = useModal();
  const dispatch = useDispatch();
  const newLinkParamInfo =
    JSON.parse(sessionStorage.getItem('newWindowLinkParamInfo'));
  // useSelector(selectNewLinkParamInfo);
  const newLinkCnt = useSelector(selectNewLinkCnt);
  const {
    setNewLinkCnt
  } = LinkSlice.actions;

  // 매개변수 정보 수정되면 재조회
  useEffect(() => {
    if (parameters.informations.length >
      parameters.filterSearchComplete.length &&
      parameters.informations.length != 0) {
      dispatch(startJob('필터 데이터를 조회 중입니다.'));
      executeParameters();
    }
  }, [parameters.informations, parameters.values]);

  useEffect(() => {
    if (parameters.informations.length != 0 &&
      parameters.filterSearchComplete.length >=
      parameters.informations.length) {
      dispatch(endJob('필터 데이터를 조회 중입니다.'));
    }
  }, [parameters.filterSearchComplete]);

  const onValueChanged = (id, value, index, reValue) => {
    const values =
      _.cloneDeep(selectRootParameter(store.getState()).values[id]);
    if (!values) return;
    if (!values?.value) return;
    if (newLinkParamInfo != null && newLinkParamInfo.length > 0 && newLinkCnt) {
      const matchedParam =
        newLinkParamInfo.find(
            (param) => param.fkParam === id);
      if (matchedParam !== undefined) {
        values.value[index] = matchedParam.value[0];
        dispatch(setNewLinkCnt(false));
      } else {
        values.value[index] = value;
      }
    } else {
      values.value[index] = value;
    }
    if (reValue?.length) {
      values.listItems = reValue;
    }
    dispatch(setParameterValues({reportId, values: {[id]: values}}));
    for (const key in parameters.values) {
      if (parameters.values[key].linkageFilter) {
        const linkageFilter = parameters.values[key].linkageFilter;
        if (linkageFilter.find((filter) => filter == id)) {
          const param = parameters.informations.
              find((info) => info.name == key);
          executeLinkageFilter(param, linkageFilter).then((values) => {
            if (values.listItems.length == 1) {
              values.value = values.value.map((v) => {
                if (v == '[All]') {
                  return values.listItems[0].name;
                }
                return v;
              });
            }
            dispatch(setParameterValues({
              reportId, values: {[param.name]: values}
            }));

            for (const idx in values.value) {
              if (parameters.values[key].value[idx] != values.value[idx]) {
                onValueChanged(param.name, values.value[idx], idx);
              }
            }
          }).catch((e) => {
            console.log(e);
          });
        }
      }
    }
  };

  const deleteConfirm = (name) => {
    confirm(localizedString.deleteParameterMsg, () => {
      dispatch(deleteParameter({reportId, name}));
    });
  };

  const deleteConfirmDsSingle = (filter) => {
    confirm(localizedString.deleteParameterMsg, () => {
      const name = filter.name;
      const uniqueName = filter.uniqueName;

      let deleteParamQuery = ' AND A.' + uniqueName +
                  ' IN (' + name + ') \n';
      // eslint-disable-next-line max-len
      deleteParamQuery = selectedDataset.datasetQuery.replace(deleteParamQuery, '');
      dispatch(deleteParameter({reportId, name}));
      dispatch(updateDataset({
        reportId: reportId,
        dataset: {
          ...selectedDataset,
          datasetQuery: deleteParamQuery
        }
      }));
    });
  };

  return (
    <Droppable droppableId="filter-bar">
      {(provided) => (
        <StyledFilterBarWrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {
            parameters.informations.reduce((acc, filter) => {
              if (!filter.visible) return acc;

              if (filter.lineBreak) {
                acc.push(<br/>);
              }

              const filterProps = {
                info: filter,
                value: parameters.values[filter.name],
                onValueChanged
              };

              let onDeleted = undefined;

              // 데이터 집합이 쿼리직접입력이 아닐 경우에만 필터 삭제 버튼
              if (filter.dsType == 'CUBE') {
                onDeleted = () => {
                  deleteConfirm(filter.name);
                };
              }

              if (filter.dsType == 'DS_SINGLE') {
                onDeleted = () => {
                  deleteConfirmDsSingle(filter);
                };
              }

              if (filter.operation == 'BETWEEN') {
                acc.push(<Filter
                  {...filterProps}
                />);
                acc.push(<Filter
                  isTo={true}
                  {...filterProps}
                  onDeleted={onDeleted}/>);
              } else {
                acc.push(<Filter
                  {...filterProps}
                  onDeleted={onDeleted}/>);
              }

              return acc;
            }, [])
          }
        </StyledFilterBarWrapper>
      )}
    </Droppable>
  );
};

export default FilterBarWrapper;
