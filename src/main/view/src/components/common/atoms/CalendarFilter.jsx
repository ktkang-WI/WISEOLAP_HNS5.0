import {DateBox} from 'devextreme-react';
import {getTheme} from 'config/theme';

const theme = getTheme();

const CalendarFilter = ({items=[], ...props}) => {
  return (
    <>
      <div id={props.id + '_wrapper'}>
        <DateBox
          focusStateEnabled={false}
          hoverStateEnabled={false}
          height={theme.size.filterHeight}
          {...props}
        />
      </div>
    </>
  );
};

export default CalendarFilter;
