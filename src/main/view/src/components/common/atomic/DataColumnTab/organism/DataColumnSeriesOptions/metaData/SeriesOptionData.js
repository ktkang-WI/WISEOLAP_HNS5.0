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
import {chartItemType} from 'components/report/item/chart/chartItemType';

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
      title: label.chart.area,
      checkboxs: [
        {
          title: label.chart.bubble,
          type: chartItemType.bubble,
          checked: false,
          src: chartImages[chartItemType.bubble]
        }
      ]
    }
  ]
};
