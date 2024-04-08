import Stepper from 'components/common/atomic/Common/Stepper/Stepper';
import PickCalendar from '../../molecules/calendar/PickCalendar';
import SetOption from '../../molecules/calendar/SetOption';

const steps = [
  {
    label: '달력 선택하기',
    content: <PickCalendar />
  },
  {
    label: '옵션 설정하기',
    content: <SetOption />
  }
];

const CalendarStepper = () => {
  const handleComplete = () => {
    console.log('click complete');
  };
  return (
    <Stepper
      steps={steps}
      onComplete={handleComplete} />
  );
};

export default CalendarStepper;
