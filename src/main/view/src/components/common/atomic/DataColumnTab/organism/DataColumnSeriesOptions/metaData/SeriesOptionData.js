import {
  generalData,
  generalKeyName,
  overlappingModeData,
  pointLabelDirectionData,
  pointLabelNotationData,
  pointerMarkerName
} from 'redux/modules/SeriesOption/SeriesOptionFormat';
import barImg from '../../../../../../../assets/image/icon/item/bar.png';
import DataColumnOption
  from '../../../molecules/DataColumnSeriesOptions/DataColumnOption';
import DataColumnPointLabel
  from '../../../molecules/DataColumnSeriesOptions/DataColumnPointLabel';
import DataColumnType
  from '../../../molecules/DataColumnSeriesOptions/DataColumnType';

export const dataSource = [
  {
    title: '시리즈 유형',
    component: <DataColumnType />
  },
  {
    title: '일반 옵션',
    component: <DataColumnOption />
  },
  {
    title: '포인트레이블 옵션',
    component: <DataColumnPointLabel />
  }
];

export const generalOptionsData = [
  {
    id: 0,
    name: generalKeyName.auxiliaryAxis,
    label: generalData.auxiliaryAxis
  },
  {
    id: 1,
    name: generalKeyName.ignoreEmptyPoints,
    label: generalData.ignoreEmptyPoints
  },
  {
    id: 2,
    name: generalKeyName.pointerMarker,
    label: generalData.pointerMarker
  },
  {
    id: 3,
    name: generalKeyName.reverseView,
    label: generalData.reverseView
  }
];

const pointLabelSelectBoxData = {
  selectBox: {
    inscriptionFormItems: [
      pointLabelNotationData.none,
      pointLabelNotationData.argument,
      pointLabelNotationData.measureName,
      pointLabelNotationData.value,
      pointLabelNotationData.argumentMeasureName,
      pointLabelNotationData.measureNameValue,
      pointLabelNotationData.argumentMeasureNameValue
    ],
    overlappingModeItems: [
      overlappingModeData.default,
      overlappingModeData.hidden,
      overlappingModeData.overlappingLabelReLocate
    ],
    directionItems: [
      pointLabelDirectionData.default,
      pointLabelDirectionData.left,
      pointLabelDirectionData.right
    ]
  }
};

export const pointLabelData = {
  pointLabel: [
    {
      id: 0,
      label: '표기형식',
      name: pointerMarkerName.Notation,
      items: pointLabelSelectBoxData.selectBox.inscriptionFormItems
    },
    {
      id: 1,
      label: '겹침모드',
      name: pointerMarkerName.overlayMode,
      items: pointLabelSelectBoxData.selectBox.overlappingModeItems
    },
    {
      id: 2,
      label: '방향',
      name: pointerMarkerName.direction,
      items: pointLabelSelectBoxData.selectBox.directionItems
    }
  ]
};

export const dataColumnTypeData = {
  dataColumnType: [
    {
      title: '막대',
      checkboxs: [
        {
          title: '막대',
          type: 'bar',
          checked: false,
          src: barImg
        },
        {
          title: '스택막대',
          type: 'stackedbar',
          checked: false,
          src: barImg
        },
        {
          title: '풀스택막대',
          type: 'fullstackedbar',
          checked: false,
          src: barImg
        }
      ]
    },
    {
      title: '점/선',
      checkboxs: [
        {
          title: '점',
          type: 'scatter',
          checked: false,
          src: barImg
        },
        {
          title: '선',
          type: 'line',
          checked: false,
          src: barImg
        },
        {
          title: '스택선',
          type: 'stackedline',
          checked: false,
          src: barImg
        },
        {
          title: '풀스택선',
          type: 'fullstackedline',
          checked: false,
          src: barImg
        },
        {
          title: '계단',
          type: 'stepline',
          checked: false,
          src: barImg
        },
        {
          title: '곡선',
          type: 'spline',
          checked: false,
          src: barImg
        }
      ]
    },
    {
      title: '영역',
      checkboxs: [
        {
          title: '영역',
          type: 'area',
          checked: false,
          src: barImg
        },
        {
          title: '스택영역',
          type: 'stackedarea',
          checked: false,
          src: barImg
        },
        {
          title: '풀스택영역',
          type: 'fullstackedarea',
          checked: false,
          src: barImg
        },
        {
          title: '계단영역',
          type: 'steparea',
          checked: false,
          src: barImg
        },
        {
          title: '곡선영역',
          type: 'splinearea',
          checked: false,
          src: barImg
        },
        {
          title: '스택곡선영역',
          type: 'stackedsplinearea',
          checked: false,
          src: barImg
        },
        {
          title: '풀스택곡선영역',
          type: 'fullstackedsplinearea',
          checked: false,
          src: barImg
        }
      ]
    },
    {
      title: '버블',
      checkboxs: [
        {
          title: '버블',
          type: 'bubble',
          checked: false,
          src: barImg
        }
      ]
    }
  ]
};
