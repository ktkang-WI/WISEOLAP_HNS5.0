import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import folder
  from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import LinkReportModal from
  'components/report/atomic/LinkReport/organisms/LinkReportModal';
import useModal from 'hooks/useModal';
import {styled} from 'styled-components';
import {useState, useEffect} from 'react';
import {checkLinkReport} from 'redux/selector/LinkSelector';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import models from 'models';

const SubLinkReportPopupButton = styled.div`
  position: fixed;
  left: ${({x}) => x}px;
  top: ${({y}) => y}px;
  z-index: 1000;
  cursor: pointer;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  user-select: none;
  &:hover {
    background-color: #0056b3;
  }
`;

export const linkReportPopup = (
    {
      focusedItem
    }
) => {
  let newSubLinkDim = [];
  if (focusedItem && focusedItem.dimension) {
    newSubLinkDim = newSubLinkDim.concat(focusedItem.dimension);
  }
  if (focusedItem && (focusedItem.column || focusedItem.row)) {
    if (focusedItem.column) {
      newSubLinkDim = newSubLinkDim.concat(focusedItem.column);
    }
    if (focusedItem.row) {
      if (!focusedItem.column || focusedItem.column !== focusedItem.row) {
        newSubLinkDim = newSubLinkDim.concat(focusedItem.row);
      }
    }
  }
  if (focusedItem && focusedItem.field) {
    focusedItem.field.forEach((item) => {
      if (item.fieldType === 'DIM') {
        newSubLinkDim.push(item);
      }
    });
  }
  const subLinkDim = (newSubLinkDim);

  return subLinkDim;
};

export const SubLinkReportPopup = (
    {
      showButton,
      setShowButton,
      focusedItem,
      editMode
    }
) => {
  const contextRoot =
    process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');
  const {openModal} = useModal();
  const [buttonPosition, setButtonPosition] = useState({x: 0, y: 0});
  const [subLinkDim, setSubLinkDim] = useState([]);
  console.log('editMode:', editMode);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      const {clientX, clientY} = event;
      setButtonPosition({x: clientX, y: clientY});
      setShowButton(true);
    };

    const handleLeftClick = () => {
      setShowButton(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleLeftClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleLeftClick);
    };
  }, [setShowButton]);

  useEffect(() => {
    let newSubLinkDim = [];

    if (focusedItem && focusedItem.dimension) {
      newSubLinkDim = newSubLinkDim.concat(focusedItem.dimension);
    }

    if (focusedItem && (focusedItem.column || focusedItem.row)) {
      if (focusedItem.column) {
        newSubLinkDim = newSubLinkDim.concat(focusedItem.column);
      }
      if (focusedItem.row) {
        if (!focusedItem.column || focusedItem.column !== focusedItem.row) {
          newSubLinkDim = newSubLinkDim.concat(focusedItem.row);
        }
      }
    }
    if (focusedItem && focusedItem.field) {
      focusedItem.field.forEach((item) => {
        if (item.fieldType === 'DIM') {
          newSubLinkDim.push(item);
        }
      });
    }

    setSubLinkDim(newSubLinkDim);
  }, [focusedItem]);

  const handleClick = () => {
    openModal(LinkReportModal, {subYn: true, subLinkDim: subLinkDim});
    setShowButton(false);
  };

  const SubLinkInfo =
      Object.values(
          useSelector(checkLinkReport)).map(
          (item) => item.subLinkReport
      );

  const selectCurrentItemVar =
    useSelector(selectCurrentItem).type + useSelector(selectCurrentItem).id;
  let subLinkReportNm;
  SubLinkInfo.forEach((report) => {
    if (report.subLinkItemId === selectCurrentItemVar) {
      subLinkReportNm = report.sublinkReportNm;
    }
  });

  const connectSubLinkReport = () => {
    let subLinklinkReportId;
    let subLinkReportType;
    if (SubLinkInfo) {
      SubLinkInfo.forEach((report) => {
        if (report.sublinkReportNm === subLinkReportNm) {
          subLinklinkReportId = report.linkReportId;
          subLinkReportType = subLinkReportType;
        }
      });
      const tokenSource = {
        userId: 'admin',
        reportId: subLinklinkReportId,
        reportType: subLinkReportType
      };
      models.Report.generateToken(tokenSource).then((res) => {
        const token = res.data.token;
        const urlString =
          `${document.location.origin}${contextRoot}` +
          `/editds/linkViewer?token=${token}`;
        const newWindow = window.open(urlString, '_blank');
        if (newWindow) {
          newWindow.focus();
        }
      }).catch((error) => {
        console.error('Error sending link report:', error);
      });
    }
  };

  if (editMode === 'viewer') {
    return showButton ? (
      <SubLinkReportPopupButton
        style={
          {
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`
          }
        }
        onClick={connectSubLinkReport}
      >
        {subLinkReportNm}
      </SubLinkReportPopupButton>
    ) : null;
  } else {
    return showButton ? (
      <SubLinkReportPopupButton
        style={
          {
            left: `${buttonPosition.x}px`,
            top: `${buttonPosition.y}px`
          }
        }
        onClick={handleClick}
      >
       서브 연결 보고서
      </SubLinkReportPopupButton>
    ) : null;
  }
};

export const setIconReportList = (list) => {
  list.map((report) => {
    if (report.type == 'FOLDER') {
      report.icon = folder;
      return;
    }

    if (report.reportType == 'DashAny') {
      report.icon = dash;
    } else if (report.reportType == 'AdHoc') {
      report.icon = adhoc;
    } else if (report.reportType == 'Spread' ||
        report.reportType == 'Excel') {
      report.icon = excel;
    }
  });
};
