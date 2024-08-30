import DateBox from 'devextreme-react/date-box';
import {getTheme} from 'config/theme';
import ParamUtils from 'components/dataset/utils/ParamUtils';
import useModal from 'hooks/useModal';
import localizedString from 'config/localization';

const theme = getTheme();

const CalendarFilter = ({info, value, isTo, onValueChanged, width}) => {
  const index = isTo ? 1 : 0;
  let dateValue = '';
  const keyFormat = info.calendarKeyFormat;
  const captionFormat = info.calendarCaptionFormat;
  const {alert} = useModal();

  if (value) {
    dateValue = ParamUtils.parseDateFromString(value.value[index], keyFormat);
  }

  let zoomLevels = {};
  let unit = 'DAY';

  switch (captionFormat) {
    case 'yyyy':
      zoomLevels = {
        zoomLevel: 'decade',
        maxZoomLevel: 'decade',
        minZoomLevel: 'decade'
      };
      unit = 'YEAR';
      break;
    case 'yyyyMM':
    case 'yyyy-MM':
      zoomLevels = {
        zoomLevel: 'year',
        maxZoomLevel: 'year',
        minZoomLevel: 'decade'
      };
      unit = 'MONTH';
      break;
    case 'yyyyMMdd':
    case 'yyyy-MM-dd':
      zoomLevels = {
        zoomLevel: 'month',
        maxZoomLevel: 'month',
        minZoomLevel: 'decade'
      };
      break;
  }

  const calculateDateDiff = (from, to) => {
    if (unit === 'YEAR') {
      return to.getFullYear() - from.getFullYear();
    }

    if (unit === 'MONTH') {
      return (to.getFullYear() - from.getFullYear()) * 12 +
          (to.getMonth() - from.getMonth());
    }

    if (unit === 'DAY') {
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
  };

  const getBoundaryValue = (value) => {
    const maxPeriod = info.calendarMaxValue * (index == 0 ? 1 : -1);
    const date = value;

    if (unit === 'YEAR') {
      date.setFullYear(date.getFullYear() + maxPeriod);
    } else if (unit === 'MONTH') {
      date.setMonth(date.getMonth() + maxPeriod);
    } else if (unit === 'DAY') {
      date.setDate(date.getDate() + maxPeriod);
    }

    return date;
  };

  return (
    <DateBox
      calendarOptions={{
        ...zoomLevels,
        firstDayOfWeek: '7'
      }}
      onValueChanged={(e) => {
        if (value && e.value) {
          let str = ParamUtils.parseStringFromDate(e.value, keyFormat);

          if (str != value.value[index]) {
            // BETWEEN일 경우 범위 검사 후 적용
            if (info.operation == 'BETWEEN') {
              if ((!isTo && str > value.value[1]) ||
                  (isTo && str < value.value[0])) {
                // Between 달력, FROM 일자를 TO 보다 뒤로 선택 예외처리를
                // 조회 할 때, 하기 위해 주석 처리
                // str = value.value[Math.abs(index - 1)];
                // alert(localizedString.invalidPeriodMsg);
              } else if (info.calendarMaxValue > 0) {
                const from = index == 0 ? e.value :
                  ParamUtils.parseDateFromString(value.value[0], keyFormat);
                const to = index == 1 ? e.value :
                    ParamUtils.parseDateFromString(value.value[1], keyFormat);

                const diff = calculateDateDiff(from, to);

                if (diff > info.calendarMaxValue) {
                  const maximumPeriodMsg = localizedString.maximumPeriodMsg
                      .replace('N', info.calendarMaxValue)
                      .replace('TYPE', localizedString[unit.toLowerCase()]);

                  alert(maximumPeriodMsg);

                  onValueChanged(info.name, str, index);

                  str = ParamUtils
                      .parseStringFromDate(
                          getBoundaryValue(e.value), keyFormat);

                  onValueChanged(info.name, str, (index + 1) % 2);
                  return;
                }
              }
            }

            onValueChanged(info.name, str, index);
          }
        } else if ((value && !e.value && value.value) || !value) {
          onValueChanged(info.name, value, index);
        }
      }}
      useMaskBehavior={true}
      type="date"
      focusStateEnabled={false}
      hoverStateEnabled={false}
      height={theme.size.filterHeight}
      value={dateValue}
      width={width}
      displayFormat={captionFormat}
    />
  );
};

export default CalendarFilter;
