import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import barImg from '../../../../../../assets/image/icon/item/bar.png';
import choroplethImg
  from '../../../../../../assets/image/icon/item/choropleth.png';
import cardImg
  from '../../../../../../assets/image/icon/item/card.png';
import liquidFillGaugeImg
  from '../../../../../../assets/image/icon/item/liquidFillGauge.png';
import squariFied
  from '../../../../../../assets/image/icon/item/squariFied.png';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import ChoroplethModal
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';
import useModal from 'hooks/useModal';

const CustomChartDefaulElement = () => {
  const reportId = useSelector(selectCurrentReportId);
  const {insertFlexLayout} = useLayout();
  const {openModal} = useModal();
  return {
    relationChart: [
      {
        imgSrc: barImg,
        label: localizedString.histogram,
        onClick: () => {
          console.log(insertFlexLayout);
        }
      }
    ],
    associativeChart: [
    ],
    compareDistritution: [
      {
        imgSrc: liquidFillGaugeImg,
        label: localizedString.liquidFillGauge,
        onClick: () => {
          insertFlexLayout(reportId, 'liquidFillGauge');
        }
      },
      {
        imgSrc: squariFied,
        label: localizedString.Treemap,
        onClick: () => {
          insertFlexLayout(reportId, 'treeMap');
        }
      }
    ],
    filter: [
    ],
    restItem: [
      {
        imgSrc: cardImg,
        label: localizedString.card,
        onClick: () => {
          insertFlexLayout(reportId, 'card');
        }
      },
      {
        imgSrc: choroplethImg,
        label: localizedString.choropleth,
        onClick: () => {
          openModal(ChoroplethModal, {
            modalTitle: localizedString.choropleth,
            label: localizedString.choropleth,
            onSubmit: (returedData) => {
              // 사용자 정의 데이터 추가 OR 업데이트
              insertFlexLayout(reportId, 'choropleth', '', returedData);
            }
          });
        }
      }
    ],
    keys: [
      'relationChart',
      'associativeChart',
      'compareDistritution',
      'filter',
      'restItem'
    ]
  };
};

export default CustomChartDefaulElement;
