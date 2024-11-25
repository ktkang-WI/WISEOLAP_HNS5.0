import {Autoplay, Pagination, Navigation} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {format} from 'date-fns';
import React, {useMemo} from 'react';

const ReportSwiper = ({
  portalUrl,
  userId,
  date,
  type,
  team,
  reportIds,
  admin
}) => {
  if (!type) return <></>;

  console.log(reportIds, type);

  const cache = useMemo(() => ({}), [date, type, team]);

  const getComponent = (id) => {
    const paramValues = {
      '@DATE': [format(date, 'yyyyMMdd')]
    };

    if (team != '전체') {
      paramValues['@MDTEAM'] = [team];
    }

    if (!cache[id]) {
      cache[id] = <iframe
        width='100%'
        height='100%'
        key={'if'+id}
        // eslint-disable-next-line max-len
        src={`${portalUrl}/linkviewer?userId=${userId}&reportId=${id}&no_header=true&reportType=DashAny&no_filter=true&portal=true&param_values=${encodeURIComponent(JSON.stringify(paramValues))}`}
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
          (reportIds[type] || []).map((id) => {
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
