import {styled, css} from 'styled-components';
import {useState} from 'react';
import {getTheme} from 'config/theme';
import filterImg from 'assets/image/icon/report/filter.png';
import FilterBarWrapper from '../molecules/FilterBarWrapper';

const theme = getTheme();

const FilterBar = ({useExpandButton=true}) => {
  const [isExpand, setIsExpand] = useState(false);

  const ExpandBtn = (props) => {
    const BtnWrapper = styled.div`
      width: 40px;
      display: flex;
      height: ${isExpand ? 'auto' : theme.size.filterBarHeight};
      flex-direction: column;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;

    const Img = styled.img`
      width: ${(props) => props.width || '16px'};
      height: auto;
      ${(props) => props.rotate && css`
          transform: rotate(180deg);
      `}
    `;

    return (
      <BtnWrapper {...props}>
        <Img src={filterImg}/>
      </BtnWrapper>
    );
  };

  const Wrapper = styled.div`
    width: calc(100% - 10px);
    background: ${theme.color.white};
    height: ${isExpand ?
      'auto' : 'calc(' + theme.size.filterBarHeight + ' + 2px)'};
    display: flex;
    box-sizing: border-box;
    border: 1px solid ${theme.color.gray200};
    border-radius: 10px;
  `;

  return (
    <Wrapper className='section'>
      {useExpandButton ?
        (<ExpandBtn isExpand={isExpand}
          onClick={() => setIsExpand(!isExpand)}></ExpandBtn>) :
        !isExpand ? setIsExpand(true) : ''
      }
      <FilterBarWrapper
        isExpand={isExpand}
      />
    </Wrapper>
  );
};

export default FilterBar;
