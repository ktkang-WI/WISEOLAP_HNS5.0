import FilterLabel from '../atom/FilterLabel';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import InputFilter from '../atom/InputFilter';
import ListFilter from '../atom/ListFilter';
import CalendarFilter from '../atom/CalendarFilter';

const theme = getTheme();

const FilterWrapper = styled.div`
  width: auto;
  height: ${theme.size.filterBarHeight};
  display: inline-flex;
  align-items: center;
  margin: 0 ${theme.margin.filterItem};
  .dx-widget input {
    font: ${theme.font.filterContent};
  }
`;


const DeleteButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 100%;
    line-height: 100px;
    font-weight: bold;
    color: gray;
  `;

// TODO: 추후 각 필터에 onChangeValue 받아서 이벤트 처리 예정
const Filter = ({info, value, isTo, onValueChanged, onDeleted}) => {
  const getParamId = (id) => {
    return id.slice(1);
  };

  const getFilter = (type) => {
    const defaultProps = {
      id: getParamId(info.name),
      width: info.width + 'px',
      info, isTo, onValueChanged, value
    };

    if (type === 'LIST') {
      return <ListFilter {...defaultProps}/>;
    }
    if (type === 'INPUT') {
      return <InputFilter {...defaultProps}/>;
    }
    if (type === 'CALENDAR') {
      return <CalendarFilter {...defaultProps}/>;
    }
  };

  return (
    <FilterWrapper>
      <FilterLabel
        className='filter-label'
        width={info.useCaptionWidth ? info.captionWidth + 'px' : null}>
        {isTo ? '~' : '\u2022 ' + info.caption}
      </FilterLabel>
      {getFilter(info.paramType)}
      {onDeleted &&
        <DeleteButton onClick={() => {
          onDeleted();
        }}>X</DeleteButton>
      }

    </FilterWrapper>
  );
};

export default Filter;
