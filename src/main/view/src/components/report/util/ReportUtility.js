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

// const theme = getTheme();

const SubLinkReportPopupButton = styled.div`
  position: absolute;
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

export const SubLinkReportPopup = (
    {
      showButton,
      setShowButton,
      event
    }
) => {
  const {openModal} = useModal();
  const [buttonPosition, setButtonPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    if (!showButton || !event) return;
    const x = event.clientX;
    //  window.scrollX;
    const y = event.clientY;
    //  window.scrollY;
    setButtonPosition({x, y});
    const handleLeftClick = () => setShowButton(false);

    document.addEventListener('click', handleLeftClick);
    return () => document.removeEventListener('click', handleLeftClick);
  }, [showButton, event]);

  const handleClick = () => {
    openModal(LinkReportModal, {subYn: true});
    setShowButton(false);
  };

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
