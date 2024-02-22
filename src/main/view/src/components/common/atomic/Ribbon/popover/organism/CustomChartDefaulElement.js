import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import barImg from '../../../../../../assets/image/icon/item/bar.png';
import choroplethImg
  from '../../../../../../assets/image/icon/item/choropleth.png';
import cardImg
  from '../../../../../../assets/image/icon/item/card.png';
import liquidFillGaugeImg
  from '../../../../../../assets/image/icon/item/liquidFillGauge.png';
import squariFied
  from '../../../../../../assets/image/icon/item/squariFied.png';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const CustomChartDefaulElement = () => {
  const reportId = useSelector(selectCurrentReportId);
  const {insertFlexLayout} = useLayout();
  return {
    relationChart: [
      {
        imgSrc: barImg,
        label: localizedString.histogram,
        onClick: () => {
          console.log(insertFlexLayout);
        }
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    associativeChart: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    compareDistritution: [
      {
        imgSrc: liquidFillGaugeImg,
        label: '액체게이지',
        onClick: () => {
          insertFlexLayout(reportId, 'liquidGauge');
        }
      },
      {
        imgSrc: squariFied,
        label: '트리맵',
        onClick: () => {
          insertFlexLayout(reportId, 'treeMap');
        }
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    filter: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    restItem: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: cardImg,
        label: '카드',
        onClick: () => {
          insertFlexLayout(reportId, 'card');
        }
      },
      {
        imgSrc: choroplethImg,
        label: '코로플레스',
        onClick: () => {
          insertFlexLayout(reportId, 'choropleth');
        }
      }
    ],
    keys: [
      'relationChart',
      'associativeChart',
      'compareDistritution',
      'filter',
      'restItem'
    ]
  };
};

export default CustomChartDefaulElement;
