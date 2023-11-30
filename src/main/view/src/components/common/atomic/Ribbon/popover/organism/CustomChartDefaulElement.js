import useLayout from 'hooks/useLayout';
import barImg from '../../../../../../assets/image/icon/item/bar.png';

const CustomChartDefaulElement = () => {
  const {insertFlexLayout} = useLayout();
  return {
    relationChart: [
      {
        src: barImg,
        label: 'ddd',
        onClick: () => {
          console.log(insertFlexLayout);
        }
      },
      {
        src: '',
        label: 'aaa'
      },
      {
        src: '',
        label: 'ccc'
      }
    ],
    associativeChart: [
      {
        src: '',
        label: 'ddd'
      },
      {
        src: '',
        label: 'aaa'
      },
      {
        src: '',
        label: 'ccc'
      }
    ],
    compareDistritution: [
      {
        src: '',
        label: 'ddd'
      },
      {
        src: '',
        label: 'aaa'
      },
      {
        src: '',
        label: 'ccc'
      }
    ],
    filter: [
      {
        src: '',
        label: 'ddd'
      },
      {
        src: '',
        label: 'aaa'
      },
      {
        src: '',
        label: 'ccc'
      }
    ],
    restItem: [
      {
        src: '',
        label: 'ddd'
      },
      {
        src: '',
        label: 'aaa'
      },
      {
        src: '',
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
