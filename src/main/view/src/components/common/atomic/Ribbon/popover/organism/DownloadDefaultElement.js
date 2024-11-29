import localizedString from 'config/localization';
import {useSelector} from 'react-redux';
import {
  selectCurrentItems,
  selectRootItem
} from 'redux/selector/ItemSelector';
import {
  selectCurrentInformationas,
  selectCurrentValues
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
import {selectRootLayout} from 'redux/selector/LayoutSelector';
import xlsImg from 'assets/image/icon/item/ico_ept_msexcell.png';
import pptImg from 'assets/image/icon/item/ico_ept_msppt.png';
import wordImg from 'assets/image/icon/item/ico_ept_msword.png';
import imagesImg from 'assets/image/icon/item/ico_exportImages.png';
import pdfImg from 'assets/image/icon/item/ico_exportPDF.png';
import csvImg from 'assets/image/icon/item/ico-csvdownload.png';
import txtImg from 'assets/image/icon/item/ico_ept_txt.png';
import useSpread from 'hooks/useSpread';
import {DesignerMode} from 'components/config/configType';
import {excelExportOptions} from
  'components/report/atomic/spreadBoard/util/spreadContants';

const DownloadDefaultElement = () => {
  const currentItem = useSelector(selectCurrentItems);
  const currentParameter = useSelector(selectCurrentInformationas);
  const currentParameterValues = useSelector(selectCurrentValues);
  const currentReport = useSelector(selectCurrentReport);
  const rootItem = useSelector(selectRootItem);
  const rootLayout = useSelector(selectRootLayout);
  const dataSource = _.cloneDeep(currentReport.options);
  const {alert} = useModal();
  const {getWorkbook} = useSpread();
  const defaultReportName = localizedString.defaultReportName;

  const checkExecuteQuery = () => {
    const item = rootItem.items;

    if (!item || item.length == 0) return false;

    const isAdHoc = rootItem.adHocOption? true : false;
    let isExecute = false;
    let itemInits = [];

    if (rootLayout.tabEnabled) {
      const selectedTabItems = item
          .filter((i) => i.tab === rootLayout.selectedTab);
      itemInits = selectedTabItems.filter((i) => !i.mart.init);
    } else {
      itemInits = item.filter((i) => !i.mart.init);
    }
    isExecute = itemInits.length !== 0 ? false : true;

    if (isAdHoc) {
      isExecute = itemInits.length === 2 ? false : true;
    };

    return isExecute;
  };

  // 비정형인 경우 레이아웃 설정에 따라 다운로드 되는 아이템이 달라야 함.
  // (ex. 그리드만 보기 -> 전체 다운로드 -> 그리드만 다운로드)
  const filterdLayoutItem = () => {
    if (currentReport.options.reportType === 'Excel') {
      const reportNm =
        currentReport.options.reportNm.replaceAll(/[\s\/\\:*?'<>]/gi, '_');
      return {type: 'excel', name: reportNm};
    };

    if (!rootItem.adHocOption) {
      return currentItem.filter((item) => item.tab === rootLayout.selectedTab);
    }

    let items = currentItem.filter((item) =>
      item.type == rootItem.adHocOption.layoutSetting
    );

    if (items.length === 0) { // 차트 피벗 전부 보기인 경우.
      items = currentItem;
    }

    return items;
  };

  const downloadSpread = (newCurrentItem) => {
    const spread = getWorkbook();

    spread.export((blob) => {
      saveAs(blob, newCurrentItem.name);
    }, () => {
      alert(localizedString.reportCorrupted);
    }, excelExportOptions);
    return;
  };

  const onClick = (type) => {
    const isExcel = currentReport.options.reportType === DesignerMode.EXCEL;
    if (!isExcel && !checkExecuteQuery()) {
      alert('조회 후 다운로드를 진행해 주세요.');
      return;
    }
    if (type === 'excelMergeXlsx') {
      const newCurrentItem = filterdLayoutItem();

      if (newCurrentItem.type === 'excel') {
        downloadSpread(newCurrentItem);
        return;
      }

      const option = {
        mergeColumn: true,
        mergeRow: true
      };
      exportExcel(
          currentReport,
          newCurrentItem,
          currentParameter,
          currentParameterValues,
          dataSource,
          option);
    } else if (type === 'excelXlsx') {
      const newCurrentItem = filterdLayoutItem();

      if (newCurrentItem.type === 'excel') {
        downloadSpread(newCurrentItem);
        return;
      }
      const option = {
        mergeColumn: false,
        mergeRow: false
      };
      exportExcel(
          currentReport,
          newCurrentItem,
          currentParameter,
          currentParameterValues,
          dataSource,
          option);
    } else if (type === 'word') {
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
    } else if (type === 'powerpoint') {
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
    } else if (type === 'img') {
      exportImg(currentReport,
          currentReport?.options?.reportNm || defaultReportName);
    } else if ( type === 'pdf') {
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
  };

  const data = [
    {
      title: localizedString.MSOffice,
      checkboxs: [
        {
          title: 'EXCEL',
          type: 'excelMergeXlsx',
          checked: false,
          src: xlsImg,
          visible: true
        },
        {
          title: localizedString.excelXlsx,
          type: 'excelXlsx',
          checked: false,
          src: xlsImg,
          visible: currentReport.options.reportType === DesignerMode.AD_HOC ?
          true : false
        },
        {
          title: localizedString.word,
          type: 'word',
          checked: false,
          src: wordImg,
          visible: currentReport.options.reportType === DesignerMode.EXCEL ?
          false : true
        },
        {
          title: localizedString.powerpoint,
          type: 'powerpoint',
          checked: false,
          src: pptImg,
          visible: currentReport.options.reportType === DesignerMode.EXCEL ?
          false : true
        }
      ]
    },
    {
      title: localizedString.etc,
      checkboxs: [
        {
          title: localizedString.img,
          type: 'img',
          checked: false,
          src: imagesImg,
          visible: currentReport.options.reportType === DesignerMode.EXCEL ?
          false : true
        },
        {
          title: localizedString.pdf,
          type: 'pdf',
          checked: false,
          src: pdfImg,
          visible: currentReport.options.reportType === DesignerMode.EXCEL ?
          false : true
        },
        {
          title: localizedString.csv,
          type: 'csv',
          checked: false,
          src: csvImg,
          visible: false
        },
        {
          title: localizedString.txt,
          type: 'txt',
          checked: false,
          src: txtImg,
          visible: false
        }
      ]
    }
  ];

  return {data, onClick};
  // {
  //   download: [
  //     {
  //       label: localizedString.MSOffice,
  //       visible: true,
  //       contents: [
  //         {
  //           label: localizedString.excelMergeXlsx,
  //           visible: true,
  //           onClick: () => {
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             const newCurrentItem = filterdLayoutItem();
  //             const option = {
  //               mergeColumn: true,
  //               mergeRow: true
  //             };
  //             exportExcel(
  //                 currentReport,
  //                 newCurrentItem,
  //                 currentParameter,
  //                 currentParameterValues,
  //                 dataSource,
  //                 option);
  //           }
  //         },
  //         {
  //           label: localizedString.excelXlsx,
  //           visible: rootItem?.adHocOption ? true : false,
  //           onClick: () => {
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             const newCurrentItem = filterdLayoutItem();
  //             const option = {
  //               mergeColumn: false,
  //               mergeRow: false
  //             };
  //             exportExcel(
  //                 currentReport,
  //                 newCurrentItem,
  //                 currentParameter,
  //                 currentParameterValues,
  //                 dataSource,
  //                 option);
  //           }
  //         },
  //         {
  //           label: localizedString.excelXls,
  //           visible: false,
  //           onClick: () => {
  //           }
  //         },
  //         {
  //           label: localizedString.word,
  //           visible: true,
  //           onClick: () => {
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             const newCurrentItem = filterdLayoutItem();
  //             const option = {
  //               mergeColumn: true,
  //               mergeRow: true
  //             };

  //             exportDocx(
  //                 currentReport,
  //                 currentReport?.options?.reportNm || defaultReportName,
  //                 newCurrentItem,
  //                 currentParameter,
  //                 option);
  //           }
  //         },
  //         {
  //           label: localizedString.powerpoint,
  //           visible: true,
  //           onClick: () => {
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             const newCurrentItem = filterdLayoutItem();
  //             const option = {
  //               mergeColumn: true,
  //               mergeRow: true
  //             };

  //             exportPptx(
  //                 currentReport,
  //                 currentReport?.options?.reportNm || defaultReportName,
  //                 newCurrentItem,
  //                 currentParameter,
  //                 option);
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       label: localizedString.hancom,
  //       visible: false,
  //       contents: [
  //         {
  //           label: localizedString.hwp,
  //           visible: true,
  //           onClick: () => {
  //           }
  //         },
  //         {
  //           label: localizedString.cell,
  //           visible: true,
  //           onClick: () => {
  //           }
  //         },
  //         {
  //           label: localizedString.pdf,
  //           visible: true,
  //           onClick: () => {
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       label: localizedString.etc,
  //       visible: true,
  //       contents: [
  //         {
  //           label: localizedString.img,
  //           visible: true,
  //           onClick: async () =>{
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             exportImg(currentReport,
  //                 currentReport?.options?.reportNm || defaultReportName);
  //           }
  //         },
  //         {
  //           label: localizedString.html,
  //           visible: false,
  //           onClick: () => {
  //           }
  //         },
  //         {
  //           label: localizedString.pdf,
  //           visible: true,
  //           onClick: () => {
  //             if (!checkExecuteQuery()) {
  //               alert('조회 후 다운로드를 진행해 주세요.');
  //               return;
  //             }

  //             const newCurrentItem = filterdLayoutItem();
  //             const option = {
  //               mergeColumn: true,
  //               mergeRow: true
  //             };

  //             exportPdf(
  //                 currentReport,
  //                 currentReport?.options?.reportNm || defaultReportName,
  //                 newCurrentItem,
  //                 currentParameter,
  //                 option);
  //           }
  //         }
  //       ]
  //     }
  //   ],
  //   keys: [
  //     'download'
  //   ]
  // };
};
export default DownloadDefaultElement;
