import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import bar from '../../../../../../assets/image/icon/button/series_type.png';

const NomalChartDefaultElement = () => {
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();
  const selectedReportId = useSelector(selectCurrentReportId);
  return {
    barChart: [
      {
        imgSrc: bar,
        label: localizedString.barChart,
        onClick: () => {
          insertFlexLayout(selectedReportId, 'chart');
          closePopover();
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
        imgSrc: bar,
        label: 'aaa',
        onClick: () => {
          insertFlexLayout(selectedReportId, 'pie');
          closePopover();
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
