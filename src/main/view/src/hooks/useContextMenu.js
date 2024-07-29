import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import localizedString from 'config/localization';
// import {selectCurrentReport} from 'redux/selector/ReportSelector';
// import LinkReportModal
//   from 'components/report/atomic/LinkReport/organisms/LinkReportModal';
import {EditMode} from 'components/config/configType';
import {
  // getSubLinkDim,
  connectLinkedReport}
  from 'components/report/util/LinkedReportUtility';
import useModal from './useModal';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
import HyperlinkModal from 'components/report/modal/HyperlinkModal';

const useContextMenu = (item) => {
  const {
    // alert,
    openModal} = useModal();
  const editmode = useSelector(selectEditMode);
  // const currentReport = useSelector(selectCurrentReport);
  const linkedReport = useSelector(selectLinkedReport);

  const getContextMenuItems = () => {
    const items = [];
    const hyperlinkModalItem = {
      'text': localizedString.hyperlinkSetting,
      'onItemClick': () => {
        openModal(HyperlinkModal, {item});
      }
    };

    // const subLinkedListModalItem = {
    //   'text': localizedString.subLinkReportSetting,
    //   'onItemClick': () => {
    //     if (currentReport.reportId === 0) {
    //       alert('보고서를 먼저 저장해주세요.');
    //       return;
    //     }
    //     const subLinkDim = getSubLinkDim();
    //     openModal(LinkReportModal,
    //         {subYn: true, subLinkDim: subLinkDim});
    //   }
    // };

    if (editmode == EditMode.DESIGNER) {
      items.push(hyperlinkModalItem);
      // items.push(subLinkedListModalItem);
    }

    items.push(...getHyperlinkItems());
    items.push(...getSubLinkedListItems());

    return items;
  };

  const getHyperlinkItems = () => {
    const hyperlinkItems = [];

    for (const link of (item?.meta?.hyperlinks || [])) {
      hyperlinkItems.push({
        text: link.name,
        onItemClick: () => {
          if (!link.link.startsWith('http')) {
            window.open('https://' + link.link, '_blank')?.focus();
          }
          window.open(link.link, '_blank')?.focus();
        }
      });
    }

    return hyperlinkItems;
  };

  const getSubLinkedListItems = () => {
    const subLinkedListItems = [];
    const key = item?.type + item?.id;

    Object.values(linkedReport).forEach((info) => {
      if (info?.subYn === 'True' &&
           key == info?.subLinkReport[0]?.subLinkItemId) {
        const reportId = info.linkReportId;
        const reportType = info.subLinkReportType || info.linkReportType;

        const param = {
          reportId: reportId,
          reportType: reportType
        };

        subLinkedListItems.push({
          text: info.linkReportId,
          onItemClick: () => {
            connectLinkedReport(param);
          }
        });
      }
    });

    return subLinkedListItems;
  };

  return {
    getContextMenuItems
  };
};

export default useContextMenu;
