import {DateBox} from 'devextreme-react';

const dateBoxOption = {
  useMaskBehavior: true,
  type: 'date',
  width: '150px',
  height: '100%',
  focusStateEnabled: false,
  hoverStateEnabled: false,
  displayFormat: 'yyyy/MM/dd'
};

const DateFilter = ({props, dateRef}) => {
  const defaultPrevDate = new Date();
  defaultPrevDate.setMonth(defaultPrevDate.getMonth() - 1);

  return (
    <div style={{
      width: '500px',
      float: 'left',
      display: 'flex',
      flexDirection: 'row',
      lineHeight: '100%',
      alignItems: 'center'
    }}
    {...props}
    >
      <DateBox
        defaultValue={defaultPrevDate}
        onValueChanged={(e) => {
          dateRef.current[0] = e.value;
        }}
        {...dateBoxOption}
      />
      <span style={{width: '20px'}}> ~ </span>
      <DateBox
        onValueChanged={(e) => {
          dateRef.current[1] = e.value;
        }}
        defaultValue={new Date()}
        {...dateBoxOption}
      />
    </div>
  );
};

export default DateFilter;
