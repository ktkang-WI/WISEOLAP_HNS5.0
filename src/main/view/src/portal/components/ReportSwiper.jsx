import {Autoplay, Pagination, Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {format} from 'date-fns';
import React, {useMemo} from 'react';

const ReportSwiper = ({portalUrl, userId, date, type}) => {
  let reportIds = []; // , 13398

  if (date != null) {
    if (type === '년누적') {
      reportIds = [13503, 13505, 13550, 13551, 13506];
    } else {
      reportIds = [13548, 13549, 13550, 13551, 13397];
    }
  }

  const cache = useMemo(() => ({}), [date, type]);

  const getComponent = (id) => {
    if (!cache[id]) {
      cache[id] = <iframe
        width='100%'
        height='100%'
        key={'if'+id}
        // eslint-disable-next-line max-len
        src={`${portalUrl}/linkviewer?userId=${userId}&reportId=${id}&no_header=true&reportType=DashAny&no_filter=true&portal=true&param_values=%7B%22@DATE%22:%5B%22${format(date, 'yyyyMMdd')}%22%5D%7D`}
      ></iframe>;
    }

    return cache[id];
  };

  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 15000,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        onPaginationRender={(swiper) => {
          swiper.pagination.bullets.forEach((bullet) => {
            bullet.addEventListener('click', () => swiper.autoplay.stop());
          });
        }}
        onSwiper={(swiper) => {
          swiper.navigation.nextEl.addEventListener('click',
              () => swiper.autoplay.stop());
          swiper.navigation.prevEl.addEventListener('click',
              () => swiper.autoplay.stop());
        }}
      >
        {
          reportIds.map((id) => {
            return (
              <SwiperSlide key={'r'+id}>
                {getComponent(id)}
              </SwiperSlide>
            );
          })
        }
      </Swiper>
    </>
  );
};

export default React.memo(ReportSwiper);
