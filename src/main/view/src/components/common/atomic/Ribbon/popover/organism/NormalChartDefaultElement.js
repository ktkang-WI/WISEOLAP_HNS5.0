import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import usePopover from 'hooks/usePopover';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import pie from 'assets/image/icon/button/pieChart.png';
import timeline from 'assets/image/icon/item/timeline.png';
import {chartImages} from 'components/report/item/util/chartImageImporter';
import {chartItemType} from 'components/report/item/chart/chartItemType';

const NormalChartDefaultElement = () => {
  // hook
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();

  // state
  const selectedReportId = useSelector(selectCurrentReportId);

  const label = localizedString.seriesOptions.label;

  const onClick = (chartType) => {
    if (['pie', 'timeline', 'rangeBar'].includes(chartType)) {
      insertFlexLayout(selectedReportId, chartType);
    } else {
      insertFlexLayout(selectedReportId, 'chart', chartType);
    }

    closePopover();
  };

  const data = [
    {
      title: label.chart.bar,
      checkboxs: [
        {
          title: label.chart.bar,
          type: chartItemType.bar,
          checked: false,
          src: chartImages[chartItemType.bar]
        },
        {
          title: label.chart.stackedbar,
          type: chartItemType.stackedbar,
          checked: false,
          src: chartImages[chartItemType.stackedbar]
        },
        {
          title: label.chart.fullstackedbar,
          type: chartItemType.fullstackedbar,
          checked: false,
          src: chartImages[chartItemType.fullstackedbar]
        },
        {
          title: label.chart.rangeBar,
          type: chartItemType.rangeBar,
          checked: false,
          src: chartImages[chartItemType.rangeBar]
        }
      ]
    },
    {
      title: label.chart.scatterline,
      checkboxs: [
        {
          title: label.chart.scatter,
          type: chartItemType.scatter,
          checked: false,
          src: chartImages[chartItemType.scatter]
        },
        {
          title: label.chart.line,
          type: chartItemType.line,
          checked: false,
          src: chartImages[chartItemType.line]
        },
        {
          title: label.chart.stackedline,
          type: chartItemType.stackedline,
          checked: false,
          src: chartImages[chartItemType.stackedline]
        },
        {
          title: label.chart.fullstackedline,
          type: chartItemType.fullstackedline,
          checked: false,
          src: chartImages[chartItemType.fullstackedline]
        },
        {
          title: label.chart.stepline,
          type: chartItemType.stepline,
          checked: false,
          src: chartImages[chartItemType.stepline]
        },
        {
          title: label.chart.spline,
          type: chartItemType.spline,
          checked: false,
          src: chartImages[chartItemType.spline]
        }
      ]
    },
    {
      title: label.chart.area,
      checkboxs: [
        {
          title: label.chart.area,
          type: chartItemType.area,
          checked: false,
          src: chartImages[chartItemType.area]
        },
        {
          title: label.chart.area,
          type: chartItemType.area,
          checked: false,
          src: chartImages[chartItemType.area]
        },
        {
          title: label.chart.stackedarea,
          type: chartItemType.stackedarea,
          checked: false,
          src: chartImages[chartItemType.stackedarea]
        },
        {
          title: label.chart.fullstackedarea,
          type: chartItemType.fullstackedarea,
          checked: false,
          src: chartImages[chartItemType.fullstackedarea]
        },
        {
          title: label.chart.steparea,
          type: chartItemType.steparea,
          checked: false,
          src: chartImages[chartItemType.steparea]
        },
        {
          title: label.chart.splinearea,
          type: chartItemType.splinearea,
          checked: false,
          src: chartImages[chartItemType.splinearea]
        },
        {
          title: label.chart.stackedsplinearea,
          type: chartItemType.stackedsplinearea,
          checked: false,
          src: chartImages[chartItemType.stackedsplinearea]
        },
        {
          title: label.chart.fullstackedsplinearea,
          type: chartItemType.fullstackedsplinearea,
          checked: false,
          src: chartImages[chartItemType.fullstackedsplinearea]
        }
      ]
    },
    {
      title: localizedString.etc,
      checkboxs: [
        {
          title: label.chart.bubble,
          type: chartItemType.bubble,
          checked: false,
          src: chartImages[chartItemType.bubble]
        },
        {
          title: localizedString.pieChart,
          type: 'pie',
          checked: false,
          src: pie
        },
        {
          title: localizedString.timeline,
          type: 'timeline',
          checked: false,
          src: timeline
        }
      ]
    }
  ];

  return {data, onClick};
};
export default NormalChartDefaultElement;
