import {styled, css} from 'styled-components';
import {useState} from 'react';
import {getTheme} from 'config/theme';
import filterImg from 'assets/image/icon/report/filter.png';
import expandImg from 'assets/image/icon/button/expand.png';
import FilterBarWrapper from '../molecules/FilterBarWrapper';

const theme = getTheme();

const FilterBar = ({useExpandButton=true}) => {
  const [isExpand, setIsExpand] = useState(false);
  const ExpandBtn = (props) => {
    const BtnWrapper = styled.div`
      width: 20px;
      display: flex;
      border-right: 1px solid ${theme.color.breakLine};
      border-bottom: 1px solid ${theme.color.breakLine};
      background: ${props.isExpand ?
      theme.color.filterBarExpand : theme.color.filterBar};
      flex-direction: column;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    `;

    const Img = styled.img`
      width: ${(props) => props.width || '17px'};
      height: auto;
      ${(props) => props.rotate && css`
          transform: rotate(180deg);
      `}
    `;

    return (
      <BtnWrapper {...props}>
        <Img src={filterImg}/>
        <Img src={expandImg} width='12px' rotate={props.isExpand}/>
      </BtnWrapper>
    );
  };

  const Wrapper = styled.div`
    width: 100%;
    height: ${isExpand ? 'auto' : theme.size.filterBarHeight};
    display: flex;
  `;

  return (
    <Wrapper>
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
