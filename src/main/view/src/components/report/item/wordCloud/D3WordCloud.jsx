import {useRef, useMemo, useCallback} from 'react';
// import D3PainterForWordCloud from './D3PainterForWordCloud';
import WordCloud from 'react-d3-cloud';
import styled from 'styled-components';

const MAX_FONT_SIZE = 150;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 150;

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

  const calculateTextWidth = (text, fontSize) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px Noto Sans KR`; // 폰트 사이즈 포함
    return context.measureText(text).width; // 텍스트의 너비 반환
  };

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
    return Math.max(1000, maxTextWidth + 50); // 1000과 maxTextWidth 중 큰 값 반환
  }, [sortedWords]);

  const getColor = (word) => {
    const normalizedValue =
      (maxOccurences - word.value) / (maxOccurences - minOccurences);
    const colorIndex = Math.round(normalizedValue * (palette.length - 1));
    return palette[colorIndex]; // 색상 팔레트에서 색상 선택
  };

  return (
    <Wrapper
      ref={svgRef}
    >
      <WordCloud
        width={Math.max(minWidth, width * 2)}
        height={Math.max(1000, height * 2)}
        fontWeight={(word) => calculateFontWeight(word.value)}
        data={sortedWords}
        font='Noto Sans KR'
        rotate={0}
        padding={1}
        spiral={'rectangular'}
        fontSize={(word) => calculateFontSize(word.value)}
        random={() => 0.5}
        fill={getColor}
      />
    </Wrapper>
  );
};

export default D3WordCloud;
