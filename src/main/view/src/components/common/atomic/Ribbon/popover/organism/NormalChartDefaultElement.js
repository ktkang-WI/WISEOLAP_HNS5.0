import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import pie from 'assets/image/icon/button/pieChart.png';
import {chartImages} from 'components/report/item/util/chartImageImporter';

const NormalChartDefaultElement = () => {
  // hook
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();

  // state
  const selectedReportId = useSelector(selectCurrentReportId);

  const chart = 'chart';

  const onClickChartItem = (selectedReportId, chart, chartType) => {
    insertFlexLayout(selectedReportId, chart, chartType);
    closePopover();
  };

  const normalChartElemet = {
    barChart: [
      {
        imgSrc: chartImages.bar1,
        label: localizedString.barChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'bar')
      },
      {
        imgSrc: chartImages.bar2,
        label: localizedString.stackedBarChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedbar')
      },
      {
        imgSrc: chartImages.bar3,
        label: localizedString.fullStackedBarChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedbar')
      }
    ],
    lineChart: [
      {
        imgSrc: chartImages.lineBar1,
        label: localizedString.scatterChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'scatter')
      },
      {
        imgSrc: chartImages.lineBar2,
        label: localizedString.lineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'line')
      },
      {
        imgSrc: chartImages.lineBar3,
        label: localizedString.stackedLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedline')
      },
      {
        imgSrc: chartImages.lineBar4,
        label: localizedString.fullStackedLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedline')
      },
      {
        imgSrc: chartImages.lineBar5,
        label: localizedString.stepLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stepline')
      },
      {
        imgSrc: chartImages.lineBar6,
        label: localizedString.splineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'spline')
      }
    ],
    areaChart: [
      {
        imgSrc: chartImages.areaBar1,
        label: localizedString.stackChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'area')
      },
      {
        imgSrc: chartImages.areaBar2,
        label: localizedString.stackedAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedarea')
      },
      {
        imgSrc: chartImages.areaBar3,
        label: localizedString.fullStackedAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedarea')
      },
      {
        imgSrc: chartImages.areaBar4,
        label: localizedString.stepAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'steparea')
      },
      {
        imgSrc: chartImages.areaBar5,
        label: localizedString.splineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'splinearea')
      },
      {
        imgSrc: chartImages.areaBar6,
        label: localizedString.stackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'stackedsplinearea')
      },
      {
        imgSrc: chartImages.areaBar7,
        label: localizedString.fullStackedSplineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart,
            'fullstackedsplineArea')
      }
    ],
    restChart: [
      // TODO: bubble chart 추가
      // {
      //   imgSrc: bubbleBar1,
      //   label: localizedString.BubbleChart,
      //   onClick: () => onClickChartItem(selectedReportId, chart, 'bubble')
      // },
      {
        imgSrc: pie,
        label: localizedString.pieChart,
        onClick: () => {
          insertFlexLayout(selectedReportId, 'pie');
          closePopover();
        }
      }
    ],
    keys: [
      'barChart',
      'lineChart',
      'areaChart',
      'restChart'
    ]
  };

  return normalChartElemet;
};
export default NormalChartDefaultElement;
