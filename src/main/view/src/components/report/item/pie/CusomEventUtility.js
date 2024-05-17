import localizedString from 'config/localization';

const getFormItems = (item) => {
  return {
    'pieChartStyle': [
      {
        id: 'pie',
        text: localizedString.pieType
      },
      {
        id: 'doughnut',
        text: localizedString.doughnutType
      }
    ],
    'labelPosition': [
      {
        id: 'columns',
        text: localizedString.columnType
      },
      {
        id: 'inside',
        text: localizedString.inside
      },
      {
        id: 'outside',
        text: localizedString.outside
      }
    ]
  };
};
export default {getFormItems};
