import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../Common/Panel/PanelTitleText';
import DataColumnList from './molecules/DataColumnList';
import dimensionIcon
  from '../../../../assets/image/icon/dataSource/dimension.png';
import measureIcon from '../../../../assets/image/icon/dataSource/measure.png';
import chartSeriesButtonIcon
  from '../../../../assets/image/icon/item/chart_bar.png';
import localizedString from '../../../../config/localization';

// TODO: 추후 redux로 교체 예정
const tempData = {
  measure: {
    label: localizedString.measure,
    icon: measureIcon,
    placeholder: localizedString.measurePlaceholder,
    type: 'MEA',
    useButton: true,
    // 우측에 버튼 추가가 필요한 경우 사용하는 옵션 ex)시리즈 옵션
    buttonIcon: chartSeriesButtonIcon,
    buttonEvent: function(e) {
      console.log(e);
    },
    columns: [
      {
        name: '이름2',
        caption: '캡션2',
        uniqueName: '[테스트].[이름]465'
      }
    ]
  },
  dimension: {
    label: localizedString.dimension,
    icon: dimensionIcon,
    placeholder: localizedString.dimensionPlaceholder,
    placeholder: '새 차원',
    type: 'DIM', // 타입은 DIM 또는 MEA. 조회시 MEA와 DIM 구분하기 위함.
    columns: [
      // uniqueName은 단일테이블이나 주제영역만 사용
      {
        name: '이름',
        caption: '캡션',
        uniqueName: '[테스트].[이름]',
        sortOrder: 'asc',
        sortColumn: '합계'},
      {
        name: '이름2',
        caption: '캡션2',
        uniqueName: '[테스트].[이름]2',
        sortOrder: 'asc',
        sortColumn: null}
    ]
  }
};

const theme = getTheme();

const TitleWrapper = styled.div`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.color.breakLine};
`;

const Wrapper = styled.div`
  background: ${theme.color.background};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
`;

const getColumnList = () => {
  const columnList = [];

  for (const key in tempData) {
    if (tempData) {
      columnList.push(
          <DataColumnList {...(tempData[key])} id={key}></DataColumnList>
      );
    }
  }

  return columnList;
};

const DataColumnTab = () => {
  return (
    <Wrapper>
      <TitleWrapper>
        <PanelTitleText color={theme.color.primary}>
          {localizedString.dataItem}
        </PanelTitleText>
      </TitleWrapper>
      {
        getColumnList()
      }
    </Wrapper>
  );
};

export default DataColumnTab;
