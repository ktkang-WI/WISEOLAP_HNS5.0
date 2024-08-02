import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {useEffect} from 'react';
import {useRef} from 'react';
import useSizeObserver from '../util/hook/useSizeObserver';
import Scheduler from 'devextreme-react/scheduler';
import _ from 'lodash';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {loadMessages} from 'devextreme/localization';
import * as koMessages from '../../../utils/ko.json';

const SchedulerComponent = ({setItemExports, id, item}) => {
  const meta = item ? item.meta : null;

  const currentDate = new Date();
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);
  const data = _.cloneDeep(meta.schedulerOption.data);
  const {updateItem} = ItemSlice.actions;
  const dispatch = useDispatch();
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const views = [
    {type: 'day', name: '일별'},
    {type: 'week', name: '주별'},
    {type: 'workWeek', name: '근무 주별'},
    {type: 'month', name: '월별'}
  ];

  const setMeta = (key, value) => {
    const item = selectedItem;
    return {
      ...item,
      meta: {
        ...item.meta,
        schedulerOption: {
          ...value
        }
      }
    };
  };

  const schedulerOption = (id, key, value) => {
    let schedulerOption = selectedItem.meta.schedulerOption;
    schedulerOption = {
      ...schedulerOption,
      [key]: value
    };

    return setMeta('schedulerOption', schedulerOption);
  };
  const handleData = () => {
    const item = schedulerOption(id, 'data', data);
    dispatch(updateItem({reportId, item}));
  };

  useEffect(() => {
    loadMessages(koMessages);
  }, []);
  return (
    <Wrapper
      ref={ref}
      id={id}>
      <Scheduler
        width={width}
        height={height}
        timeZone="Asia/Seoul"
        dataSource={data}
        views={views}
        defaultCurrentView="month"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        onAppointmentAdded={handleData}
        onAppointmentUpdated={handleData}
        onAppointmentDeleted={handleData}
      />
    </Wrapper>
  );
};

export default React.memo(SchedulerComponent);
