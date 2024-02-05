import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import bar from '../../../../../../assets/image/icon/button/series_type.png';
import pie from '../../../../../../assets/image/icon/button/pieChart.png';

const NomalChartDefaultElement = () => {
  const {insertFlexLayout} = useLayout();
  const selectedReportId = useSelector(selectCurrentReportId);
  return {
    barChart: [
      {
        imgSrc: bar,
        label: localizedString.barChart,
        onClick: () => {
          insertFlexLayout(selectedReportId, 'chart');
        }
      },
      {
        imgSrc: bar,
        label: 'aaa',
        onClick: () => {
          console.log('test');
        }
      },
      {
        imgSrc: bar,
        label: 'ccc'
      },
      {
        imgSrc: bar,
        label: 'dddd'
      }
    ],
    lineChart: [
      {
        imgSrc: bar,
        label: 'ddd'
      },
      {
        imgSrc: bar,
        label: 'aaa'
      },
      {
        imgSrc: bar,
        label: 'ccc'
      }
    ],
    areaChart: [
      {
        imgSrc: bar,
        label: 'ddd'
      },
      {
        imgSrc: bar,
        label: 'aaa'
      },
      {
        imgSrc: bar,
        label: 'ccc'
      }
    ],
    restChart: [
      {
        imgSrc: bar,
        label: 'ddd'
      },
      {
        imgSrc: pie,
        label: localizedString.pieChart,
        onClick: () => {
          insertFlexLayout(selectedReportId, 'pie');
        }
      },
      {
        imgSrc: bar,
        label: 'ccc'
      }
    ],
    keys: [
      'barChart',
      'lineChart',
      'areaChart',
      'restChart'
    ]
  };
};
export default NomalChartDefaultElement;
