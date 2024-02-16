import {styled, css} from 'styled-components';
import {useState} from 'react';
import {getTheme} from 'config/theme';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import FilterBarWrapper from '../molecules/FilterBarWrapper';
import ribbonDefaultElement
  from 'components/common/atomic/Ribbon/organism/RibbonDefaultElement';
import filterImg from 'assets/image/icon/report/filter.png';
import expandImg from 'assets/image/icon/button/expand.png';
import useReportSave from 'hooks/useReportSave';

const theme = getTheme();

const ViewerFilterBar = ({useExpandButton=true}) => {
  const [isExpand, setIsExpand] = useState(false);
  const {querySearch} = useReportSave();
  const queryButton = ribbonDefaultElement()['QuerySearch'];

  const ExpandBtn = (props) => {
    const BtnWrapper = styled.div`
      width: 20px;
      height: 100%;
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

  const QueryButtonWrapper = styled.div`
    height: 100%;
    min-height: ${theme.size.filterBarHeight};
    background: ${isExpand ?
      theme.color.filterBarExpand : theme.color.filterBar};
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${theme.color.breakLine};
    padding-right: 20px;
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
      <QueryButtonWrapper>
        <CommonButton
          label={queryButton.label}
          title={queryButton.title}
          width={queryButton.width}
          height={queryButton.height}
          onClick={querySearch}
          type='secondary'
          borderRadius='4px'
          font={theme.font.ribbonButton}
        >
          <img src={queryButton.icon}/>
          {queryButton.label}
        </CommonButton>
      </QueryButtonWrapper>
    </Wrapper>
  );
};

export default ViewerFilterBar;
