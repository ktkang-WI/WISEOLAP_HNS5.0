import chordImg from 'assets/image/icon/item/chord.png';
import boxPlotImg from 'assets/image/icon/item/box_plot.png';

import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import choroplethImg
  from '../../../../../../assets/image/icon/item/choropleth.png';
import cardImg
  from '../../../../../../assets/image/icon/item/card.png';
import liquidFillGaugeImg
  from '../../../../../../assets/image/icon/item/liquidFillGauge.png';
import squariFied
  from '../../../../../../assets/image/icon/item/squariFied.png';
import calendarImg
  from '../../../../../../assets/image/icon/item/ico_calendarviewchart.png';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import ChoroplethModal
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';
import useModal from 'hooks/useModal';
import ItemType from 'components/report/item/util/ItemType';
import usePopover from 'hooks/usePopover';

const CustomChartDefaulElement = () => {
  const reportId = useSelector(selectCurrentReportId);
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();
  const {openModal} = useModal();
  const selectedReportId = useSelector(selectCurrentReportId);
  const {
    LIQUID_FILL_GAUGE,
    TREEMAP,
    CHOROPLETH,
    CARD,
    CHORD,
    BOX_PLOT,
    CALENDAR
  } = ItemType;
  const onClick = (type) => {
    onClickExecutor(type);
  };

  const onClickExecutor = (type) => {
    switch (type) {
      case CHOROPLETH: {
        openModal(ChoroplethModal, {
          modalTitle: localizedString.choropleth,
          label: localizedString.choropleth,
          onSubmit: (returedData) => {
            insertFlexLayout(reportId, 'choropleth', '', returedData);
          }
        });
        break;
      }
      default: {
        insertFlexLayout(selectedReportId, type);
        closePopover();
      }
    }
  };

  const data = [
    {
      title: localizedString.relationVisualization,
      checkboxs: [
      ]
    },
    {
      title: localizedString.connectionVisualization,
      checkboxs: [
        {
          title: localizedString.chordDiagram,
          type: CHORD,
          checked: false,
          src: chordImg
        },
        {
          title: localizedString.calendar,
          type: CALENDAR,
          checked: false,
          src: calendarImg
        }
      ]
    },
    {
      title: localizedString.distributionVisualization,
      checkboxs: [
        {
          title: localizedString.boxPlot,
          type: BOX_PLOT,
          checked: false,
          src: boxPlotImg
        },
        {
          title: localizedString.liquidFillGauge,
          type: LIQUID_FILL_GAUGE,
          checked: false,
          src: liquidFillGaugeImg
        },
        {
          title: localizedString.Treemap,
          type: TREEMAP,
          checked: false,
          src: squariFied
        }
      ]
    },
    {
      title: localizedString.filter,
      checkboxs: [
      ]
    },
    {
      title: localizedString.etc,
      checkboxs: [
        {
          title: localizedString.card,
          type: CARD,
          checked: false,
          src: cardImg
        },
        {
          title: localizedString.choropleth,
          type: CHOROPLETH,
          checked: false,
          src: choroplethImg
        }
      ]
    }
  ];

  return {data, onClick};
};

export default CustomChartDefaulElement;
