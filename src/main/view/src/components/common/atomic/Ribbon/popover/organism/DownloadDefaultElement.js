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
import {
  exportDocx,
  exportExcel,
  exportImg,
  exportPdf,
  exportPptx
} from 'components/report/util/ReportDownload';
import useModal from 'hooks/useModal';

const DownloadDefaultElement = () => {
  const currentItem = useSelector(selectCurrentItems);
  const currentParameter = useSelector(selectCurrentInformationas);
  const currentReport = useSelector(selectCurrentReport);
  const rootItem = useSelector(selectRootItem);
  const dataSource = _.cloneDeep(currentReport.options);
  const {alert} = useModal();
  const defaultReportName = localizedString.defaultReportName;

  const checkExecuteQuery = () => {
    const item = rootItem.items;

    if (!item || item.length == 0) return false;

    const isAdHoc = rootItem.adHocOption? true : false;
    const itemInits = item.filter((i) => !i.mart.init);

    let isExecute = false;
    isExecute = itemInits.length !== 0 ? false : true;

    if (isAdHoc) {
      isExecute = itemInits.length === 2 ? false : true;
    };

    return isExecute;
  };

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

  const checkItemInit = () => {
    const res = currentItem.every(({mart}) => mart.init);
    if (!res) {
      alert(localizedString.downloadNeedViewItemsMsg);
    }

    return res;
  };

  return {
    download: [
      {
        label: localizedString.MSOffice,
        visible: true,
        contents: [
          {
            label: localizedString.excelMergeXlsx,
            visible: true,
            onClick: () => {
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              const newCurrentItem = filterdLayoutItem();
              const option = {
                mergeColumn: true,
                mergeRow: true
              };
              exportExcel(
                  currentReport,
                  newCurrentItem,
                  currentParameter,
                  dataSource,
                  option);
            }
          },
          {
            label: localizedString.excelXlsx,
            visible: rootItem?.adHocOption ? true : false,
            onClick: () => {
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              const newCurrentItem = filterdLayoutItem();
              const option = {
                mergeColumn: false,
                mergeRow: false
              };
              exportExcel(
                  currentReport,
                  newCurrentItem,
                  currentParameter,
                  dataSource,
                  option);
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
            visible: true,
            onClick: () => {
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              const newCurrentItem = filterdLayoutItem();
              const option = {
                mergeColumn: true,
                mergeRow: true
              };

              exportDocx(
                  currentReport,
                  currentReport?.options?.reportNm || defaultReportName,
                  newCurrentItem,
                  currentParameter,
                  option);
            }
          },
          {
            label: localizedString.powerpoint,
            visible: true,
            onClick: () => {
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              const newCurrentItem = filterdLayoutItem();
              const option = {
                mergeColumn: true,
                mergeRow: true
              };

              exportPptx(
                  currentReport,
                  currentReport?.options?.reportNm || defaultReportName,
                  newCurrentItem,
                  currentParameter,
                  option);
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
        visible: true,
        contents: [
          {
            label: localizedString.img,
            visible: true,
            onClick: async () =>{
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              exportImg(currentReport,
                  currentReport?.options?.reportNm || defaultReportName);
            }
          },
          {
            label: localizedString.html,
            visible: false,
            onClick: () => {
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
              if (!checkExecuteQuery()) {
                alert('조회 후 다운로드를 진행해 주세요.');
                return;
              }

              if (!checkItemInit()) {
                return;
              }

              const newCurrentItem = filterdLayoutItem();
              const option = {
                mergeColumn: true,
                mergeRow: true
              };

              exportPdf(
                  currentReport,
                  currentReport?.options?.reportNm || defaultReportName,
                  newCurrentItem,
                  currentParameter,
                  option);
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
