import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import bar from '../../../../../../assets/image/icon/button/series_type.png';
import pie from '../../../../../../assets/image/icon/button/pieChart.png';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {useDispatch} from 'react-redux';

const NomalChartDefaultElement = (seriesTypeCompact) => {
  const dispatch = useDispatch();
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();
  const {updateItem} = ItemSlice.actions;
  const selectedReportId = useSelector(selectCurrentReportId);
  const chart = 'chart';
  const onClickChartItem = (selectedReportId, chart, chartType) => {
    if (!seriesTypeCompact) {
      insertFlexLayout(selectedReportId, chart, chartType);
    } else {
      editSeriesType(chartType);
    }
    closePopover();
  };

  const editSeriesType = (chartType) => {
    const item = _.cloneDeep(selectCurrentItem(store.getState()));
    item.meta.seriesType = chartType;
    dispatch(updateItem({reportId: selectedReportId, item: item}));
  };

  const makeCompactNomalElemet = (
      seriesTypeCompact,
      nomalChartElemet) => {
    if (seriesTypeCompact) {
      nomalChartElemet['restChart'] =
        nomalChartElemet['restChart'].filter((element) =>
          element.label !== localizedString.pieChart
        );
    }
    return nomalChartElemet;
  };

  const nomalChartElemet = {
    barChart: [
      {
        imgSrc: bar,
        label: localizedString.barChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'bar')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedBarChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedbar')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedBarChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedbar')
      }
    ],
    lineChart: [
      {
        imgSrc: bar,
        label: localizedString.scatterChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'scatter')
      },
      {
        imgSrc: bar,
        label: localizedString.lineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'line')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedline')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedline')
      },
      {
        imgSrc: bar,
        label: localizedString.stepLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stepline')
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
        onClick: () => onClickChartItem(selectedReportId, chart, 'area')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedarea')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedarea')
      },
      {
        imgSrc: bar,
        label: localizedString.stepAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'steparea')
      },
      {
        imgSrc: bar,
        label: localizedString.splineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'splinearea')
      },
      {
        imgSrc: bar,
        label: localizedString.stackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'stackedsplinearea')
      },
      {
        imgSrc: bar,
        label: localizedString.fullStackedSplineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart,
            'fullstackedsplineArea')
      }
    ],
    restChart: [
      {
        imgSrc: bar,
        label: localizedString.BubbleChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'bubble')
      },
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

  return makeCompactNomalElemet(seriesTypeCompact, nomalChartElemet);
};
export default NomalChartDefaultElement;
