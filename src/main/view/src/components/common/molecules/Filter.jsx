import FilterLabel from '../atoms/FilterLabel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import InputFilter from '../atoms/InputFilter';
import ListFilter from '../atoms/ListFilter';
import CalendarFilter from '../atoms/CalendarFilter';

const theme = getTheme();

const FilterWrapper = styled.div`
  width: auto;
  height: ${theme.size.filterBarHeight};
  display: flex;
  align-items: center;
  margin: 0 ${theme.margin.filterItem};
  .dx-widget input {
    font: ${theme.font.filterContent};
  }
`;

// TODO: 추후 각 필터에 onChangeValue 받아서 이벤트 처리 예정
const Filter = ({data, key}) => {
  const getParamId = (id) => {
    return id.slice(1);
  };

  const getFilter = (type) => {
    if (type === 'LIST') {
      return <ListFilter
        id={getParamId(data.PARAM_NM)}
        width={data.WIDTH + 'px'}/>;
    }
    if (type === 'INPUT') {
      return <InputFilter
        id={getParamId(data.PARAM_NM)}
        width={data.WIDTH + 'px'}/>;
    }
    if (type === 'CALENDAR') {
      return <CalendarFilter
        id={getParamId(data.PARAM_NM + 'px')}
        width={data.WIDTH}/>;
    }
  };

  return (
    <FilterWrapper>
      <FilterLabel>{data.PARAM_CAPTION}</FilterLabel>
      {getFilter(data.PARAM_TYPE)}
    </FilterWrapper>
  );
};

export default Filter;
