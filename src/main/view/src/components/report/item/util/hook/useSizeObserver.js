import {useState, useEffect} from 'react';

export default function useSizeObserver(ref) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setHeight(ref.current?.offsetHeight || 0);
      setWidth(ref.current?.offsetWidth || 0);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {height, width};
};
