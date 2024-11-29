import {useEffect, useState} from 'react';

const Timer = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 현재 시간을 업데이트
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, []);


  return (
    <h3>{time.toLocaleTimeString()}</h3>
  );
};

export default Timer;
