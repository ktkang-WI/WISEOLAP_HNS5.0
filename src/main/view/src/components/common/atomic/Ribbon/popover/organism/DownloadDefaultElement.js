import localizedString from 'config/localization';
import store from 'redux/modules';
import {useSelector} from 'react-redux';
import {selectCurrentItems} from 'redux/selector/ItemSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {handleDownload} from 'components/report/util/ReportDownload';

const DownloadDefaultElement = () => {
  const items = selectCurrentItems(store.getState());
  const parameters = selectRootParameter(store.getState());
  const currentReport = useSelector(selectCurrentReport);
  const dataSource = _.cloneDeep(currentReport.options);
  const downloadAllSet = {items, parameters, dataSource};
  console.log('downloadAllSet', downloadAllSet);
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
              handleDownload(items, parameters, dataSource);
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
