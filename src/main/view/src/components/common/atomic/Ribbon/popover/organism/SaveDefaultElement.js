import localizedString from 'config/localization';
import usePopover from 'hooks/usePopover';

const SaveDefaultElement = () => {
  const {closePopover} = usePopover();
  return {
    save: [
      {
        label: localizedString.saveReport, // 저장
        onClick: () => {
          closePopover();
        }
      },
      {
        label: localizedString.saveAs, // 다른이름으로 저장
        onClick: () => {
          closePopover();
        }
      }
    ],
    keys: [
      'save'
    ]
  };
};
export default SaveDefaultElement;
