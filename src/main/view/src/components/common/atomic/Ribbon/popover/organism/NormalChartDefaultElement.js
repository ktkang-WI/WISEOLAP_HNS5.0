import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import pie from 'assets/image/icon/button/pieChart.png';
import {chartImages} from 'components/report/item/util/chartImageImporter';
import {chartItemType} from 'components/report/item/chart/chartItemType';

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
        imgSrc: chartImages[chartItemType.bar],
        label: localizedString.barChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.bar)
      },
      {
        imgSrc: chartImages[chartItemType.stackedbar],
        label: localizedString.stackedBarChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.stackedbar)
      },
      {
        imgSrc: chartImages[chartItemType.fullstackedbar],
        label: localizedString.fullStackedBarChart,
        onClick: () =>
          onClickChartItem(
              selectedReportId, chart, chartItemType.fullstackedbar)
      }
    ],
    lineChart: [
      {
        imgSrc: chartImages[chartItemType.scatter],
        label: localizedString.scatterChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.scatter)
      },
      {
        imgSrc: chartImages[chartItemType.line],
        label: localizedString.lineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.line)
      },
      {
        imgSrc: chartImages[chartItemType.stackedline],
        label: localizedString.stackedLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.stackedline)
      },
      {
        imgSrc: chartImages[chartItemType.fullstackedline],
        label: localizedString.fullStackedLineChart,
        onClick: () =>
          onClickChartItem(
              selectedReportId, chart, chartItemType.fullstackedline)
      },
      {
        imgSrc: chartImages[chartItemType.stepline],
        label: localizedString.stepLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.stepline)
      },
      {
        imgSrc: chartImages[chartItemType.spline],
        label: localizedString.splineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.spline)
      }
    ],
    areaChart: [
      {
        imgSrc: chartImages[chartItemType.area],
        label: localizedString.stackChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.area)
      },
      {
        imgSrc: chartImages[chartItemType.stackedarea],
        label: localizedString.stackedAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.stackedarea)
      },
      {
        imgSrc: chartImages[chartItemType.fullstackedarea],
        label: localizedString.fullStackedAreaChart,
        onClick: () =>
          onClickChartItem(
              selectedReportId, chart, chartItemType.fullstackedarea)
      },
      {
        imgSrc: chartImages[chartItemType.steparea],
        label: localizedString.stepAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.steparea)
      },
      {
        imgSrc: chartImages[chartItemType.splinearea],
        label: localizedString.splineAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, chartItemType.splinearea)
      },
      {
        imgSrc: chartImages[chartItemType.stackedsplinearea],
        label: localizedString.stackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(
              selectedReportId, chart, chartItemType.stackedsplinearea)
      },
      {
        imgSrc: chartImages[chartItemType.fullstackedsplinearea],
        label: localizedString.fullStackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(
              selectedReportId, chart, chartItemType.fullstackedsplinearea)
      }
    ],
    restChart: [
      // TODO: bubble chart 추가
      // {
      //   imgSrc: chartImages[chartItemType.bubble],
      //   label: localizedString.BubbleChart,
      //   onClick: ()
      //   => onClickChartItem(selectedReportId, chart, chartItemType.bubble)
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
