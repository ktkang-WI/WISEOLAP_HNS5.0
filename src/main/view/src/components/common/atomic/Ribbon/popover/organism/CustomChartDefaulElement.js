import chordImg from 'assets/image/icon/item/chord.png';
import arcImg from 'assets/image/icon/item/arc.png';
import boxPlotImg from 'assets/image/icon/item/box_plot.png';

import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import choroplethImg from 'assets/image/icon/item/choropleth.png';
import cardImg from 'assets/image/icon/item/card.png';
import liquidFillGaugeImg from 'assets/image/icon/item/water_gauge.png';
import wordCloudImg from 'assets/image/icon/item/wordcloud.png';
import treeMapImg from 'assets/image/icon/item/treemap.png';
import calendarImg
  from '../../../../../../assets/image/icon/item/calendar_view.png';
import coordinateLineImg from 'assets/image/icon/item/coordinate_line.png';
import textBoxImg
  from '../../../../../../assets/image/icon/item/ico_textbox.png';
import coordinateDotImg from 'assets/image/icon/item/coordinate_dot.png';
import heatMapImg from 'assets/image/icon/item/heatmap.png';
import collapsibleTreeImg from 'assets/image/icon/item/collapsible_tree.png';
import radialTreeImg from 'assets/image/icon/item/radial_tidy_tree.png';
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
    CALENDAR,
    CHORD_DIAGRAM,
    BOX_PLOT,
    HEAT_MAP,
    WORDCLOUD,
    TEXT_BOX
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
        {
          title: localizedString.wordCloud,
          type: WORDCLOUD,
          checked: false,
          src: wordCloudImg
        }
      ]
    },
    {
      title: localizedString.connectionVisualization,
      checkboxs: [
        {
          title: localizedString.chordDiagram,
          type: CHORD_DIAGRAM,
          checked: false,
          src: chordImg
        },
        {
          title: localizedString.calendar,
          type: CALENDAR,
          checked: false,
          src: calendarImg
        },
        {
          title: localizedString.arcDiagram,
          type: ItemType.ARC_DIAGRAM,
          checked: false,
          src: arcImg
        }
      ]
    },
    {
      title: localizedString.distributionVisualization,
      checkboxs: [
        {
          title: localizedString.heatMap,
          type: HEAT_MAP,
          checked: false,
          src: heatMapImg
        },
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
          src: treeMapImg
        },
        {
          title: localizedString.planeCoordinateLine,
          type: ItemType.COORDINATE_LINE,
          checked: false,
          src: coordinateLineImg
        },
        {
          title: localizedString.planeCoordinatePoint,
          type: ItemType.COORDINATE_DOT,
          checked: false,
          src: coordinateDotImg
        },
        {
          title: localizedString.collapsibleTree,
          type: ItemType.COLLAPSIBLE_TREE,
          checked: false,
          src: collapsibleTreeImg
        },
        {
          title: localizedString.radialNeuralNetwork,
          type: ItemType.RADIAL_TREE,
          checked: false,
          src: radialTreeImg
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
        },
        {
          title: localizedString.textBox,
          type: TEXT_BOX,
          checked: false,
          src: textBoxImg
        }
      ]
    }
  ];

  return {data, onClick};
};

export default CustomChartDefaulElement;
