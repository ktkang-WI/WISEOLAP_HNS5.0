import localizedString from 'config/localization';
import store from 'redux/modules';
import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import models from 'models';

const DownloadDefaultElement = () => {
  const items = selectCurrentItems(store.getState());
  const parameters = selectRootParameter(store.getState());
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);
  const downloadAllSet = {items, parameters, dataSource};
  console.log('downloadAllSet', downloadAllSet);

  function replacer(key, value) {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  }

  const safeStringify = (obj) => JSON.stringify(obj, replacer());
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
              models.Report.downloadReportAll(
                  safeStringify(downloadAllSet), '.xlsx');
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
