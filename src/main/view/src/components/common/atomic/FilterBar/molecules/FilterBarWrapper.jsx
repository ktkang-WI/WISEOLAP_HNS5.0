import {Droppable} from 'react-beautiful-dnd';
import localizedString from 'config/localization';
import Filter from './Filter';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import useQueryExecute from 'hooks/useQueryExecute';
import ParameterSlice from 'redux/modules/ParameterSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import _ from 'lodash';
import useModal from 'hooks/useModal';

const theme = getTheme();

const StyledFilterBarWrapper = styled.div`
    height: 100%;
    min-height: ${theme.size.filterBarHeight};
    width: calc(100% - 20px);
    background: ${(props) => props.isExpand ?
      theme.color.filterBarExpand : theme.color.filterBar};
    display: block;
    overflow: hidden;
    box-sizing: border-box;
    text-align: left;
    border-bottom: 1px solid ${theme.color.breakLine};
  `;

const FilterBarWrapper = (props) => {
  const parameters = useSelector(selectRootParameter);
  const reportId = selectCurrentReportId(store.getState());
  const {executeParameters, executeLinkageFilter} = useQueryExecute();
  const {setParameterValues, deleteParameter} = ParameterSlice.actions;
  const {confirm} = useModal();
  const dispatch = useDispatch();

  // 매개변수 정보 수정되면 재조회
  useEffect(() => {
    if (parameters.filterSearchComplete.length == 0) {
      executeParameters();
    }
  }, [parameters.informations, parameters.values]);

  const onValueChanged = (id, value, index) => {
    const values = _.cloneDeep(parameters.values[id]);
    if (!values) return;
    values.value[index] = value;
    dispatch(setParameterValues({reportId, values: {[id]: values}}));

    for (const key in parameters.values) {
      if (parameters.values[key].linkageFilter) {
        const linkageFilter = parameters.values[key].linkageFilter;
        if (linkageFilter.find((filter) => filter == id)) {
          const param = parameters.informations.
              find((info) => info.name == key);
          executeLinkageFilter(param, linkageFilter).then((values) => {
            dispatch(setParameterValues({
              reportId, values: {[param.name]: values}
            }));

            for (const idx in values.value) {
              if (parameters.values[key].value[idx] != values.value[idx]) {
                onValueChanged(param.name, values[idx], idx);
              }
            }
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

  return (
    <Droppable droppableId="filter-bar">
      {(provided) => (
        <StyledFilterBarWrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {
            parameters.informations.reduce((acc, filter) => {
              const filterProps = {
                key: filter.name,
                info: filter,
                value: parameters.values[filter.name],
                onValueChanged
              };

              let onDeleted = undefined;

              if (filter.dsType == 'CUBE') {
                onDeleted = () => {
                  deleteConfirm(filter.name);
                };
              }

              if (filter.operation == 'BETWEEN') {
                acc.push(<Filter {...filterProps}/>);
                acc.push(<Filter
                  isTo={true}
                  {...filterProps}
                  onDeleted={onDeleted}/>);
              } else {
                acc.push(<Filter
                  {...filterProps}
                  onDeleted={onDeleted}/>);
              }

              if (filter.lineBreak) {
                acc.push(<br/>);
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
