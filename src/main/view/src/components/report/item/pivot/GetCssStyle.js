import EmojiArr from './modal/molecules/EmojiArr';

const GetCssStyle = (highlight, cellElement, cell) => {
  const isEmoji = () => { // 이모지 적용.
    if (highlight.emojiList) {
      cellElement.innerHTML =
        '<img src='+
          EmojiArr[highlight.emojiList].icon +
        ' style="float:left" />'+
        cellElement.innerHTML;
    }
  };

  const colorStyle = (highlight) => { // 배경 및 글자색 적용.
    return {
      'background-color': highlight.backgroundColor,
      'color': highlight.fontColor
    };
  };

  if (highlight.idx == cell.dataIndex) { // 조건 형식 추가.
    if (highlight.condition === '>') {
      if (Number(highlight.valueFrom) < cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '>=') {
      if (Number(highlight.valueFrom) >= cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '<') {
      if (Number(highlight.valueFrom) > cell.value) {
        isEmoji();
        return colorStyle(highlight);
      }
    } else if (highlight.condition === '<=') {
      if (Number(highlight.valueFrom) <= cell.value) {
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
export default GetCssStyle;
