import {styled, css} from 'styled-components';
import {useState} from 'react';
import {getTheme} from 'config/theme';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import FilterBarWrapper
  from 'components/common/atomic/Common/Wrap/FilterBarWrapper';
import ribbonDefaultElement
  from 'components/common/atomic/Ribbon/organism/RibbonDefaultElement';
import filterImg from 'assets/image/icon/report/filter.png';
import expandImg from 'assets/image/icon/button/expand.png';

const theme = getTheme();

const tempFitlerData = [
  {
    'DEFAULT_VALUE': '[All]',
    'WIDTH': 300,
    'DATASRC': 'D_자동차종류',
    'WHERE_CLAUSE': 'D_자동차종류.자동차명',
    'DATASRC_TYPE': 'TBL',
    'VISIBLE': 'Y',
    'BIND_YN': 'Y',
    'RANGE_YN': '',
    'ORDER': 1,
    'KEY_FORMAT': '',
    'RANGE_VALUE': '',
    'DEFAULT_VALUE_MAINTAIN': 'N',
    'HIDDEN_VALUE': '',
    'CAPTION_VALUE_ITEM': '자동차명',
    'SEARCH_YN': 'N',
    'DATA_TYPE': 'STRING',
    'SORT_TYPE': '',
    'KEY_VALUE_ITEM': '자동차명',
    'PARAM_CAPTION': 'CAR2',
    'CAND_PERIOD_BASE': '',
    'CAND_DEFAULT_TYPE': '',
    'PARAM_NM': '@CAR2',
    'EDIT_YN': 'N',
    'SORT_VALUE_ITEM': '',
    'OPER': 'In',
    'TYPE_CHANGE_YN': 'Y',
    'DS_ID': 5145,
    'ALL_YN': 'Y',
    'MULTI_SEL': 'Y',
    'CAND_PERIOD_VALUE': '',
    'UNI_NM': '@CAR2',
    'PARAM_TYPE': 'INPUT',
    'CAPTION_FORMAT': '',
    'DEFAULT_VALUE_USE_SQL_SCRIPT': 'N',
    'value': [
      '_ALL_'
    ],
    'defaultValue': '[All]',
    'whereClause': 'D_자동차종류.자동차명',
    'wiseVariables': [],
    'ORDERBY_KEY': '',
    'cubeId': 0,
    'DS_TYPE': 'DS'
  },
  {
    'DEFAULT_VALUE': '[All]',
    'WIDTH': 300,
    'DATASRC': 'D_자동차종류',
    'WHERE_CLAUSE': 'D_자동차종류.자동차명',
    'DATASRC_TYPE': 'TBL',
    'VISIBLE': 'Y',
    'BIND_YN': 'Y',
    'RANGE_YN': '',
    'ORDER': 1,
    'KEY_FORMAT': '',
    'RANGE_VALUE': '',
    'DEFAULT_VALUE_MAINTAIN': 'N',
    'HIDDEN_VALUE': '',
    'CAPTION_VALUE_ITEM': '자동차명',
    'SEARCH_YN': 'N',
    'DATA_TYPE': 'STRING',
    'SORT_TYPE': '',
    'KEY_VALUE_ITEM': '자동차명',
    'PARAM_CAPTION': 'CAR',
    'CAND_PERIOD_BASE': '',
    'CAND_DEFAULT_TYPE': '',
    'PARAM_NM': '@CAR',
    'EDIT_YN': 'N',
    'SORT_VALUE_ITEM': '',
    'OPER': 'In',
    'TYPE_CHANGE_YN': 'Y',
    'DS_ID': 5145,
    'ALL_YN': 'Y',
    'MULTI_SEL': 'Y',
    'CAND_PERIOD_VALUE': '',
    'UNI_NM': '@CAR',
    'PARAM_TYPE': 'LIST',
    'CAPTION_FORMAT': '',
    'DEFAULT_VALUE_USE_SQL_SCRIPT': 'N',
    'value': [
      '_ALL_'
    ],
    'defaultValue': '[All]',
    'whereClause': 'D_자동차종류.자동차명',
    'wiseVariables': [],
    'ORDERBY_KEY': '',
    'cubeId': 0,
    'DS_TYPE': 'DS'
  },
  {
    'DEFAULT_VALUE': '2021년01월',
    'ALARM_RANGE_CONDITION': '',
    'CAPTION_WIDTH': 86.5,
    'WIDTH': 130,
    'ALARM_CONTENT': '',
    'DATASRC': 'SELECT DISTINCT 마감년월\nFROM DEMO_EMPLOY_JOB',
    'WHERE_CLAUSE': '마감년월',
    'LINE_BREAK': 'N',
    'CAND_MAX_GAP': '',
    'CAPTION_WIDTH_VISIBLE': 'N',
    'DATASRC_TYPE': 'QUERY',
    'VISIBLE': 'Y',
    'BIND_YN': 'N',
    'RANGE_YN': 'N',
    'ORDER': 0,
    'KEY_FORMAT': '',
    'RANGE_VALUE': '',
    'DEFAULT_VALUE_MAINTAIN': 'N',
    'HIDDEN_VALUE': '',
    'CAPTION_VALUE_ITEM': '마감년월',
    'SEARCH_YN': 'Y',
    'DATA_TYPE': 'STRING',
    'SORT_TYPE': 'ASC',
    'KEY_VALUE_ITEM': '마감년월',
    'PARAM_CAPTION': '마감년월',
    'CAND_PERIOD_BASE': '',
    'CAND_DEFAULT_TYPE': '',
    'ALARM_CONDITION': '',
    'PARAM_NM': '@YM',
    'EDIT_YN': 'N',
    'SORT_VALUE_ITEM': '',
    'OPER': 'In',
    'ORDERBY_KEY': '',
    'TYPE_CHANGE_YN': 'N',
    'DS_ID': 5205,
    'ALL_YN': 'Y',
    'MULTI_SEL': 'Y',
    'CAND_PERIOD_VALUE': 0,
    'UNI_NM': '@YM',
    'ALARM_YN': 'N',
    'PARAM_TYPE': 'CALENDAR',
    'CAPTION_FORMAT': '',
    'DEFAULT_VALUE_USE_SQL_SCRIPT': 'N',
    'wiseVariables': [],
    'cubeId': 0,
    'DS_TYPE': 'DS',
    'value': [
      '2021년01월'
    ]
  }
];

const ViewerFilterBar = ({useExpandButton=true}) => {
  const [isExpand, setIsExpand] = useState(false);
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
        tempFitlerData={tempFitlerData}
        isExpand={isExpand}
      />
      <QueryButtonWrapper>
        <CommonButton
          label={queryButton.label}
          title={queryButton.title}
          width={queryButton.width}
          height={queryButton.height}
        >
          {queryButton.label}
        </CommonButton>
      </QueryButtonWrapper>
    </Wrapper>
  );
};

export default ViewerFilterBar;
