import localizedString from 'config/localization';
import store from 'redux/modules';
import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
// import {downloadSet} from 'components/report/util/ReportDownload';

const DownloadDefaultElement = () => {
  const items = selectCurrentItems(store.getState());
  const parameters = selectRootParameter(store.getState());
  const reportType = selectCurrentDesignerMode(store.getState());
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);

  return {
    download: [
      {
        label: localizedString.MSOffice,
        visible: true,
        contents: [
          {
            label: localizedString.excelXlsx,
            visible: true,
            onClick: () => {
              console.log('items', items);
              console.log('parameters', parameters);
              console.log('reportType', reportType);
              console.log('dataSource', dataSource);
              // downloadSet(0, dataSource, items,
              // reportType, parameters, 'xlsx');
            }
          },
          {
            label: localizedString.excelXls,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.word,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.powerpoint,
            visible: true,
            onClick: () => {
            }
          }
        ]
      },
      {
        label: localizedString.hancom,
        visible: true,
        contents: [
          {
            label: localizedString.hwp,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.cell,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
            }
          }
        ]
      },
      {
        label: localizedString.etc,
        visible: true,
        contents: [
          {
            label: localizedString.img,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.html,
            visible: true,
            onClick: () => {
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
            }
          }
        ]
      }
    ],
    keys: [
      'download'
    ]
  };
};
export default DownloadDefaultElement;
