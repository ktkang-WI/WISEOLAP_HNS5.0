import localizedString from 'config/localization';
import usePopover from 'hooks/usePopover';

const DownloadDefaultElement = () => {
  const {closePopover} = usePopover();
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
              closePopover();
            }
          },
          {
            label: localizedString.excelXls,
            visible: true,
            onClick: () => {
              closePopover();
            }
          },
          {
            label: localizedString.word,
            visible: true,
            onClick: () => {
              closePopover();
            }
          },
          {
            label: localizedString.powerpoint,
            visible: true,
            onClick: () => {
              closePopover();
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
              closePopover();
            }
          },
          {
            label: localizedString.cell,
            visible: true,
            onClick: () => {
              closePopover();
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
              closePopover();
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
              closePopover();
            }
          },
          {
            label: localizedString.html,
            visible: true,
            onClick: () => {
              closePopover();
            }
          },
          {
            label: localizedString.pdf,
            visible: true,
            onClick: () => {
              closePopover();
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
