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
        src: bar,
        label: localizedString.barChart,
        locatoin: 'barChart',
        onClick: () => {
          insertFlexLayout(selectedReportId, 'chart');
          closePopover();
        }
      },
      {
        src: bar,
        label: 'aaa',
        locatoin: 'barChart',
        onClick: () => {
          console.log('test');
        }
      },
      {
        src: bar,
        label: 'ccc',
        locatoin: 'barChart'
      },
      {
        src: bar,
        label: 'dddd',
        locatoin: 'barChart'
      }
    ],
    lineChart: [
      {
        src: bar,
        label: 'ddd',
        locatoin: 'lineChart'
      },
      {
        src: bar,
        label: 'aaa',
        locatoin: 'lineChart'
      },
      {
        src: bar,
        label: 'ccc',
        locatoin: 'lineChart'
      }
    ],
    areaChart: [
      {
        src: bar,
        label: 'ddd',
        locatoin: 'areaChart'
      },
      {
        src: bar,
        label: 'aaa',
        locatoin: 'areaChart'
      },
      {
        src: bar,
        label: 'ccc',
        locatoin: 'areaChart'
      }
    ],
    restChart: [
      {
        src: bar,
        label: 'ddd',
        locatoin: 'restChart'
      },
      {
        src: bar,
        label: 'aaa',
        locatoin: 'restChart'
      },
      {
        src: bar,
        label: 'ccc',
        locatoin: 'restChart'
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
