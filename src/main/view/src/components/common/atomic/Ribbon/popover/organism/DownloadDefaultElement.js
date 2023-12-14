import localizedString from 'config/localization';

const DownloadDefaultElement = () => {
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
