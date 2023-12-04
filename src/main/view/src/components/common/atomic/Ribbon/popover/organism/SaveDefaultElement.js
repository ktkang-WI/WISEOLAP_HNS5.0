import localizedString from 'config/localization';

const SaveDefaultElement = () => {
  return {
    save: [
      {
        label: localizedString.saveReport, // 저장
        onClick: () => {
        }
      },
      {
        label: localizedString.saveAs, // 다른이름으로 저장
        onClick: () => {
        }
      }
    ],
    keys: [
      'save'
    ]
  };
};
export default SaveDefaultElement;
