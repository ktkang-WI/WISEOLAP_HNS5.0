import {getTheme} from 'config/theme';
import Modal from './Modal';
import {createContext} from 'react';
import CalendarStepper from '../../Stepper/organism/choropleth/CalendarStepper';

export const CalendarContext = createContext();

const theme = getTheme();
const {
} = theme;
const CalendarModal = ({
  onSubmit,
  modalTitle,
  label,
  defaultValue='',
  ...props
}) => {
  const context = {

  };
  return (
    <CalendarContext.Provider
      value={context}
    >
      <Modal
        modalTitle={modalTitle}
        width={'1000px'}
        height={'650px'}
        onSubmit={() => {
          return true;
        }}
        {...props}
      >
        <CalendarStepper />
      </Modal>
    </CalendarContext.Provider>
  );
};

export default CalendarModal;
