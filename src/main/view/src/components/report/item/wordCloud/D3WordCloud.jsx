import React, {useRef, useMemo, useCallback} from 'react';
// import D3PainterForWordCloud from './D3PainterForWordCloud';
import WordCloud from 'react-d3-cloud';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  
  & div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const D3WordCloud = ({
  dataSource,
  valueField,
  labelField,
  palette,
  width,
  height
}) => {
  if (width <= 0 || height <= 0) {
    return <></>;
  }
  // 폰트 사이즈 데이터 양에 따라 편차 두기
  const getMaxFontSize = () => {
    if (dataSource.length > 80) {
      return 100;
    } else if (dataSource.length > 30) {
      return 150;
    } else {
      return 200;
    }
  };

  const getMinFontSize = () => {
    if (dataSource.length > 30) {
      return 30;
    } else {
      return 80;
    }
  };

  const getPadding = () => {
    if (dataSource.length > 50) {
      return 1;
    } else if (dataSource.length > 20) {
      return 10;
    }

    return 20;
  };

  const PADDING = useMemo(getPadding, [dataSource]);
  const MAX_FONT_SIZE = useMemo(getMaxFontSize, [dataSource]);
  const MIN_FONT_SIZE = useMemo(getMinFontSize, [dataSource]);
  const MAX_FONT_WEIGHT = 700;
  const MIN_FONT_WEIGHT = 400;
  const MAX_WORDS = 150;

  const svgRef = useRef(null);

  const sortedWords = useMemo(
      () => _.cloneDeep(dataSource)
          .sort((a, b) => b[valueField] - a[valueField])
          .slice(0, MAX_WORDS)
          .map((data) => ({value: data[valueField], text: data[labelField]})),
      [dataSource]
  );

  const [minOccurences, maxOccurences] = useMemo(() => {
    const min = Math.min(...sortedWords.map((w) => w.value));
    const max = Math.max(...sortedWords.map((w) => w.value));
    return [min, max];
  }, [sortedWords]);

  const calculateFontSize = useCallback((wordOccurrences) => {
    const normalizedValue =
      (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
    const fontSize =
      MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
    return Math.round(fontSize);
  },
  [maxOccurences, minOccurences]
  );

  const calculateTextWidth = useCallback((text, fontSize) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px Noto Sans KR`; // 폰트 사이즈 포함
    return context.measureText(text).width; // 텍스트의 너비 반환
  }, []);

  const calculateFontWeight = useCallback((wordOccurrences) => {
    const normalizedValue =
      (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
    const fontWeight =
      MIN_FONT_WEIGHT +
      normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
    return Math.round(fontWeight);
  },
  [maxOccurences, minOccurences]
  );

  const minWidth = useMemo(() => {
    const maxTextWidth = sortedWords.reduce((maxWidth, word) => {
      const fontSize = calculateFontSize(word.value); // 해당 단어의 폰트 크기 계산
      const width = calculateTextWidth(word.text, fontSize); // 계산된 폰트 크기를 사용
      return Math.max(maxWidth, width);
    }, 0);
    return maxTextWidth + 100; // 1000과 maxTextWidth 중 큰 값 반환
  }, [sortedWords]);

  const getColor = useCallback((word) => {
    const logValue = Math.log(word.value + 1);
    const logMin = Math.log(minOccurences + 1);
    const logMax = Math.log(maxOccurences + 1);

    if (logMax === logMin) {
      return palette[0];
    }

    const normalizedValue = (logValue - logMin) / (logMax - logMin);

    const clampedNormalizedValue =
      1 - Math.max(0, Math.min(1, normalizedValue));

    const colorIndex = Math.round(clampedNormalizedValue *
      (palette.length - 1));

    return palette[colorIndex];
  }, [maxOccurences, minOccurences, palette]);

  const ratio = width / height;
  const minHeight = minWidth / ratio;

  const svgHeight = Math.round(Math.max(minHeight, height * 2));
  const svgWidth = Math.round(Math.max(minWidth, width * 2));

  return (
    <Wrapper
      ref={svgRef}
    >
      <WordCloud
        width={svgWidth}
        height={svgHeight}
        fontWeight={(word) => calculateFontWeight(word.value)}
        data={sortedWords}
        font='Noto Sans KR'
        rotate={0}
        padding={PADDING}
        spiral={'rectangular'}
        fontSize={(word) => calculateFontSize(word.value)}
        random={() => 0.5}
        fill={getColor}
      />
    </Wrapper>
  );
};

export default React.memo(D3WordCloud);
