import EmojiArr from './modal/molecules/EmojiArr';

const getCssStyle = (highlight, cellElement, cell) => {
  // 이모지 적용.
  const isEmoji = () => {
    if (highlight.emojiList >= 0) {
      cellElement.innerHTML =
        '<img src='+
          EmojiArr[highlight.emojiList].icon +
        ' style="float:left" />'+
        cellElement.innerHTML;
    }
  };

  // 배경 및 글자색 적용.
  const colorStyle = (highlight) => {
    return {
      'background-color': highlight.backgroundColor,
      'color': highlight.fontColor
    };
  };

  // 조건 형식 추가.
  if (highlight.idx == cell.dataIndex) {
    if (highlight.condition === '>') {
      if (Number(highlight.valueFrom) < cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '>=') {
      if (Number(highlight.valueFrom) <= cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '<') {
      if (Number(highlight.valueFrom) > cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '<=') {
      if (Number(highlight.valueFrom) >= cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '<>') {
      if (Number(highlight.valueFrom) != cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '=') {
      if (Number(highlight.valueFrom) == cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === 'Between') {
      if (Number(highlight.valueFrom) < cell.value &&
      cell.value < Number(highlight.valueTo)) {
        isEmoji();
        return colorStyle(highlight);
      }
    }
  }
};
export default getCssStyle;
