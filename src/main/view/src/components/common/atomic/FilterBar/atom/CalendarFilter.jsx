import DateBox from 'devextreme-react/date-box';
import {getTheme} from 'config/theme';
import ParamUtils from 'components/dataset/utils/ParamUtils';

const theme = getTheme();

const CalendarFilter = ({info, key, value, isTo, onValueChanged, ...props}) => {
  const index = isTo ? 1 : 0;
  let dateValue = '';
  const keyFormat = info.calendarKeyFormat;
  const captionFormat = info.calendarCaptionFormat;
  if (value) {
    dateValue = ParamUtils.parseDateFromString(value.value[index], keyFormat);
  }

  let zoomLevels = {};

  switch (captionFormat) {
    case 'yyyy':
      zoomLevels = {
        zoomLevel: 'decade',
        maxZoomLevel: 'decade',
        minZoomLevel: 'decade'
      };
      break;
    case 'yyyyMM':
    case 'yyyy-MM':
      zoomLevels = {
        zoomLevel: 'year',
        maxZoomLevel: 'year'
      };
      break;
    case 'yyyyMMdd':
    case 'yyyy-MM-dd':
      zoomLevels = {};
      break;
  }

  return (
    <>
      <div id={props.id + '_wrapper'}>
        <DateBox
          calendarOptions={{
            ...zoomLevels
          }}
          onValueChanged={(e) => {
            if (value && e.value) {
              const str = ParamUtils.parseStringFromDate(e.value, keyFormat);

              if (str != value.value[index]) {
                onValueChanged(info.name, str, index);
              }
            } else if ((value && !e.value && value.value) || !value) {
              onValueChanged(info.name, '', index);
            }
          }}
          useMaskBehavior={true}
          type="date"
          focusStateEnabled={false}
          hoverStateEnabled={false}
          height={theme.size.filterHeight}
          value={dateValue}
          displayFormat={captionFormat}
        />
      </div>
    </>
  );
};

export default CalendarFilter;
