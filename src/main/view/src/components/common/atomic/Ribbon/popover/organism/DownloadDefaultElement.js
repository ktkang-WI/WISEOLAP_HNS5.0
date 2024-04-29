import localizedString from 'config/localization';
import {useSelector} from 'react-redux';
import {
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {
  selectCurrentInformationas
} from 'redux/selector/ParameterSelector';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {handleDownload} from 'components/report/util/ReportDownload';

const DownloadDefaultElement = () => {
  const currentItem = useSelector(selectCurrentItems);
  const currentParameter = useSelector(selectCurrentInformationas);
  const currentReport = useSelector(selectCurrentReport);
  const rootItem = useSelector(selectRootItem);
  const dataSource = _.cloneDeep(currentReport.options);

  // 비정형인 경우 레이아웃 설정에 따라 다운로드 되는 아이템이 달라야 함.
  // (ex. 그리드만 보기 -> 전체 다운로드 -> 그리드만 다운로드)
  const filterdLayoutItem = () => {
    if (!rootItem.adHocOption) return currentItem;

    let items = currentItem.filter((item) =>
      item.type == rootItem.adHocOption.layoutSetting
    );

    if (items.length === 0) { // 차트 피벗 전부 보기인 경우.
      items = currentItem;
    }

    return items;
  };

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
              const newCurrentItem = filterdLayoutItem();

              handleDownload(newCurrentItem, currentParameter, dataSource);
            }
          },
          {
            label: localizedString.excelXls,
            visible: false,
            onClick: () => {
            }
          },
          {
            label: localizedString.word,
            visible: false,
            onClick: () => {
            }
          },
          {
            label: localizedString.powerpoint,
            visible: false,
            onClick: () => {
            }
          }
        ]
      },
      {
        label: localizedString.hancom,
        visible: false,
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
        visible: false,
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
