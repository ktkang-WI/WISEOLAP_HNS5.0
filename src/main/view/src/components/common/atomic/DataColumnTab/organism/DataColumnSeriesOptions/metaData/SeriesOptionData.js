import {
  generalData,
  generalKeyName,
  overlappingModeData,
  pointLabelDirectionData,
  pointLabelNotationData,
  pointerMarkerKeyName
} from 'redux/modules/SeriesOption/SeriesOptionFormat';
import DataColumnOption
  from '../../../molecules/DataColumnSeriesOptions/DataColumnOption';
import DataColumnPointLabel
  from '../../../molecules/DataColumnSeriesOptions/DataColumnPointLabel';
import DataColumnType
  from '../../../molecules/DataColumnSeriesOptions/DataColumnType';
import localizedString from 'config/localization';
import {chartImages} from 'components/report/item/util/chartImageImporter';

const label = localizedString.seriesOptions.label;

export const dataSource = [
  {
    title: label.menu.seriesOptions,
    component: <DataColumnType />
  },
  {
    title: label.menu.general,
    component: <DataColumnOption />
  },
  {
    title: label.menu.pointLabel,
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
      label: label.pointLabel.Notation,
      name: pointerMarkerKeyName.Notation,
      items: pointLabelSelectBoxData.selectBox.inscriptionFormItems
    },
    {
      id: 1,
      label: label.pointLabel.overlayMode,
      name: pointerMarkerKeyName.overlayMode,
      items: pointLabelSelectBoxData.selectBox.overlappingModeItems
    },
    {
      id: 2,
      label: label.pointLabel.direction,
      name: pointerMarkerKeyName.direction,
      items: pointLabelSelectBoxData.selectBox.directionItems
    }
  ]
};

export const dataColumnTypeData = {
  dataColumnType: [
    {
      title: label.chart.bar,
      checkboxs: [
        {
          title: label.chart.bar,
          type: 'bar',
          checked: false,
          src: chartImages.bar1
        },
        {
          title: label.chart.stackedbar,
          type: 'stackedbar',
          checked: false,
          src: chartImages.bar2
        },
        {
          title: label.chart.fullstackedbar,
          type: 'fullstackedbar',
          checked: false,
          src: chartImages.bar3
        }
      ]
    },
    {
      title: label.chart.scatterline,
      checkboxs: [
        {
          title: label.chart.scatter,
          type: 'scatter',
          checked: false,
          src: chartImages.lineBar1
        },
        {
          title: label.chart.line,
          type: 'line',
          checked: false,
          src: chartImages.lineBar2
        },
        {
          title: label.chart.stackedline,
          type: 'stackedline',
          checked: false,
          src: chartImages.lineBar3
        },
        {
          title: label.chart.fullstackedline,
          type: 'fullstackedline',
          checked: false,
          src: chartImages.lineBar4
        },
        {
          title: label.chart.stepline,
          type: 'stepline',
          checked: false,
          src: chartImages.lineBar5
        },
        {
          title: label.chart.spline,
          type: 'spline',
          checked: false,
          src: chartImages.lineBar6
        }
      ]
    },
    {
      title: label.chart.area,
      checkboxs: [
        {
          title: label.chart.area,
          type: 'area',
          checked: false,
          src: chartImages.areaBar1
        },
        {
          title: label.chart.stackedarea,
          type: 'stackedarea',
          checked: false,
          src: chartImages.areaBar2
        },
        {
          title: label.chart.fullstackedarea,
          type: 'fullstackedarea',
          checked: false,
          src: chartImages.areaBar3
        },
        {
          title: label.chart.steparea,
          type: 'steparea',
          checked: false,
          src: chartImages.areaBar4
        },
        {
          title: label.chart.splinearea,
          type: 'splinearea',
          checked: false,
          src: chartImages.areaBar5
        },
        {
          title: label.chart.stackedsplinearea,
          type: 'stackedsplinearea',
          checked: false,
          src: chartImages.areaBar6
        },
        {
          title: label.chart.fullstackedsplinearea,
          type: 'fullstackedsplinearea',
          checked: false,
          src: chartImages.areaBar7
        }
      ]
    },
    {
      title: label.chart.area,
      checkboxs: [
        {
          title: label.chart.bubble,
          type: 'bubble',
          checked: false,
          src: chartImages.bubbleBar1
        }
      ]
    }
  ]
};
