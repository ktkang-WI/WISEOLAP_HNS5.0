import localizedString from 'config/localization';
import useLayout from 'hooks/useLayout';
import barImg from '../../../../../../assets/image/icon/item/bar.png';

const CustomChartDefaulElement = () => {
  const {insertFlexLayout} = useLayout();
  return {
    relationChart: [
      {
        imgSrc: barImg,
        label: localizedString.histogram,
        onClick: () => {
        }
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    associativeChart: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    compareDistritution: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    filter: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
      }
    ],
    restItem: [
      {
        imgSrc: '',
        label: 'ddd'
      },
      {
        imgSrc: '',
        label: 'aaa'
      },
      {
        imgSrc: '',
        label: 'ccc'
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
