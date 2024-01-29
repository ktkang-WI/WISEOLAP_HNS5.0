import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
// TODO: image file 불러오기 추후 수정
import bar1 from 'assets/image/icon/button/series_type.png';
import bar2 from 'assets/image/icon/button/stackbar.png';
import bar3 from 'assets/image/icon/button/fullstackbar.png';

import lineBar1 from 'assets/image/icon/button/ico_pointLine1.png';
import lineBar2 from 'assets/image/icon/button/ico_pointLine2.png';
import lineBar3 from 'assets/image/icon/button/ico_pointLine3.png';
import lineBar4 from 'assets/image/icon/button/ico_pointLine4.png';
import lineBar5 from 'assets/image/icon/button/ico_pointLine5.png';
import lineBar6 from 'assets/image/icon/button/ico_pointLine6.png';

import areaBar1 from 'assets/image/icon/button/ico_area1.png';
import areaBar2 from 'assets/image/icon/button/ico_area2.png';
import areaBar3 from 'assets/image/icon/button/ico_area3.png';
import areaBar4 from 'assets/image/icon/button/ico_area4.png';
import areaBar5 from 'assets/image/icon/button/ico_area5.png';
import areaBar6 from 'assets/image/icon/button/ico_area6.png';
import areaBar7 from 'assets/image/icon/button/ico_area7.png';

// TODO: bubble chart 추가 예정
// import bubbleBar1 from 'assets/image/icon/button/ico_bubble1.png';

import pie from 'assets/image/icon/button/pieChart.png';
import ItemSlice from 'redux/modules/ItemSlice';
import store from 'redux/modules';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {useDispatch} from 'react-redux';

const NormalChartDefaultElement = (seriesTypeCompact) => {
  // action
  const {updateItem} = ItemSlice.actions;

  // hook
  const dispatch = useDispatch();
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();

  // state
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

  const makeCompactNormalElemet = (
      seriesTypeCompact,
      normalChartElemet) => {
    if (seriesTypeCompact) {
      delete normalChartElemet['restChart'];
      normalChartElemet.keys.pop();
      // TODO: bubble chart 추가
      // normalChartElemet['restChart'].filter((element) =>
      //   element.label !== localizedString.pieChart
      // );
    }
    return normalChartElemet;
  };

  const normalChartElemet = {
    barChart: [
      {
        imgSrc: bar1,
        label: localizedString.barChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'bar')
      },
      {
        imgSrc: bar2,
        label: localizedString.stackedBarChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedbar')
      },
      {
        imgSrc: bar3,
        label: localizedString.fullStackedBarChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedbar')
      }
    ],
    lineChart: [
      {
        imgSrc: lineBar1,
        label: localizedString.scatterChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'scatter')
      },
      {
        imgSrc: lineBar2,
        label: localizedString.lineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'line')
      },
      {
        imgSrc: lineBar3,
        label: localizedString.stackedLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedline')
      },
      {
        imgSrc: lineBar4,
        label: localizedString.fullStackedLineChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedline')
      },
      {
        imgSrc: lineBar5,
        label: localizedString.stepLineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stepline')
      },
      {
        imgSrc: lineBar6,
        label: localizedString.splineChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'spline')
      }
    ],
    areaChart: [
      {
        imgSrc: areaBar1,
        label: localizedString.stackChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'area')
      },
      {
        imgSrc: areaBar2,
        label: localizedString.stackedAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'stackedarea')
      },
      {
        imgSrc: areaBar3,
        label: localizedString.fullStackedAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'fullstackedarea')
      },
      {
        imgSrc: areaBar4,
        label: localizedString.stepAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'steparea')
      },
      {
        imgSrc: areaBar5,
        label: localizedString.splineAreaChart,
        onClick: () => onClickChartItem(selectedReportId, chart, 'splinearea')
      },
      {
        imgSrc: areaBar6,
        label: localizedString.stackedSplineAreaChart,
        onClick: () =>
          onClickChartItem(selectedReportId, chart, 'stackedsplinearea')
      },
      {
        imgSrc: areaBar7,
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

  return makeCompactNormalElemet(seriesTypeCompact, normalChartElemet);
};
export default NormalChartDefaultElement;
