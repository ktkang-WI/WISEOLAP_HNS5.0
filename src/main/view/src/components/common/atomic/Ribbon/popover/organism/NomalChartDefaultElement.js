import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import bar from '../../../../../../assets/image/icon/button/series_type.png';
import pie from '../../../../../../assets/image/icon/button/pieChart.png';

const NomalChartDefaultElement = ({changeChartTypeMode = false}) => {
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();
  const selectedReportId = useSelector(selectCurrentReportId);
  const chart = 'chart';
  const onClickChartItem = (selectedReportId, chart, chartType) => {
    if (!changeChartTypeMode) {
      insertFlexLayout(selectedReportId, chart, chartType);
      closePopover();
    } else {
      console.log('test');
    }
  };

  return {
    barChart: [
      {
        imgSrc: bar,
        label: localizedString.barChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'bar')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedBarChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedBar')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedBarChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullStackedBar')
      }
    ],
    lineChart: [
      {
        imgSrc: bar,
        label: localizedString.pointChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'point')
      },
      {
        imgSrc: bar,
        label: localizedString.lineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'line')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedLine')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullStackedLine')
      },
      {
        imgSrc: bar,
        label: localizedString.stepLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stepLine')
      },
      {
        imgSrc: bar,
        label: localizedString.splineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'spline')
      }
    ],
    areaChart: [
      {
        imgSrc: bar,
        label: localizedString.stackChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stack')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedArea')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullStackedArea')
      },
      {
        imgSrc: bar,
        label: localizedString.stepAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stepArea')
      },
      {
        imgSrc: bar,
        label: localizedString.splineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'splineArea')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'stackedSplineArea')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedSplineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart,
            'fullStackedSplineArea')
      }
    ],
    restChart: [
      {
        imgSrc: pie,
        label: localizedString.pieChart,
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
