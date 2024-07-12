import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import Filter from 'components/common/atomic/FilterBar/molecules/Filter';
import React, {useState} from 'react';
// eslint-disable-next-line max-len
import FilterBarBtn from 'components/common/atomic/FilterBar/atom/FilterBarBtn';
import filterImg from 'assets/image/icon/report/filter.png';

const theme = getTheme();

const Img = styled.img`
  width: ${(props) => props.width || '16px'};
  height: auto;
  ${(props) => props.rotate && css`
      transform: rotate(180deg);
  `}
`;

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


const ViewQueryFilterBar = ({state, onValueChanged}) => {
  const [isExpand, setIsExpand] = useState(false);

  const Wrapper = styled.div`
    background: ${theme.color.white};
    height: ${isExpand ?
      'auto' : 'calc(' + theme.size.filterBarHeight + ' + 2px)'};
    display: flex;
    box-sizing: border-box;
    border: 1px solid ${theme.color.gray200};
    border-radius: 10px;
  `;

  return (
    <Wrapper>
      <FilterBarBtn
        isExpand={isExpand}
        justifyContent={'center'}
        onClick={() => setIsExpand(!isExpand)}>
        <Img src={filterImg}/>
      </FilterBarBtn>
      <StyledFilterBarWrapper>
        {
          state.informations.reduce((acc, filter) => {
            if (!filter.visible) return acc;

            if (filter.lineBreak) {
              acc.push(<br/>);
            }

            const filterProps = {
              info: filter,
              value: state.values[filter.name],
              onValueChanged
            };

            if (filter.operation == 'BETWEEN') {
              acc.push(<Filter
                {...filterProps}
              />);
              acc.push(<Filter
                isTo={true}
                {...filterProps}
              />);
            } else {
              acc.push(<Filter
                {...filterProps}
              />);
            }

            return acc;
          }, [])
        }
      </StyledFilterBarWrapper>
    </Wrapper>
  );
};

export default React.memo(ViewQueryFilterBar);
