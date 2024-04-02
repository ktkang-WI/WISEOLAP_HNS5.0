import chordImg from 'assets/image/icon/item/chord.png';
import arcImg from 'assets/image/icon/item/arc.png';
import boxPlotImg from 'assets/image/icon/item/box_plot.png';

import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import ItemType from 'components/report/item/util/ItemType';
import usePopover from 'hooks/usePopover';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';

const CustomChartDefaulElement = () => {
  const {insertFlexLayout} = useLayout();
  const {closePopover} = usePopover();

  const selectedReportId = useSelector(selectCurrentReportId);

  const onClick = (type) => {
    insertFlexLayout(selectedReportId, type);

    closePopover();
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
          type: ItemType.CHORD_DIAGRAM,
          checked: false,
          src: chordImg
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
          title: localizedString.boxPlot,
          type: ItemType.BOX_PLOT,
          checked: false,
          src: boxPlotImg
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
      ]
    }
  ];

  return {data, onClick};
};

export default CustomChartDefaulElement;
