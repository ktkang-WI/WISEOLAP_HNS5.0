import EmojiArr from './modal/molecules/EmojiArr';
// import loacalizedString from 'config/localization';/

// 합계, 총계, 셀 check에 대한 분기 처리 함수.
export const isDataCell = (cell, area, highlight) => {
  const arr = [];
  const map = new Map();
  if (highlight.type === 'dimension' && area == 'data') return false;

  if (area == highlight.flag) {
    if (highlight.type === 'dimension' && cell.type == 'D') {
      return cell.text == cell.path[highlight.idx];
    } else if (highlight.type === 'dimension' && highlight.applyTotal) {
      if (cell.type == 'T') {
        return (
          cell.text == cell.path[highlight.idx]
        );
      }
    }
  };

  // 셀 선택 시
  if (highlight.applyCell) {
    map.set('applyCell', {'D': true});
    arr.push('applyCell');
  }
  // 합계 셀 선택 시
  if (highlight.applyTotal) {
    map.set('applyTotal', {'T': true});
    arr.push('applyTotal');
  }
  // 총계 셀 선택 시
  if (highlight.applyGrandTotal) {
    map.set('applyGrandTotal', {'GT': true});
    arr.push('applyGrandTotal');
  }
  // 합계, 총계, 셀 중 하나만 선택 시.
  if (area === 'data' && arr.length == 1) {
    if (arr[0] === 'applyCell') {
      return (
        map.get('applyCell') && (
          map.get('applyCell')[cell.columnType] &&
          map.get('applyCell')[cell.rowType]
        ));
    } else if (arr[0] === 'applyTotal') {
      return (
        map.get('applyTotal') && (
          map.get('applyTotal')[cell.columnType] ||
          map.get('applyTotal')[cell.rowType]
        )
      );
    } else {
      return (
        map.get('applyGrandTotal') && (
          map.get('applyGrandTotal')[cell.columnType] ||
          map.get('applyGrandTotal')[cell.rowType]
        )
      );
    }
  // 합계, 총계, 셀 중 없는 Type 찾기.
  } else if (area === 'data' && arr.length == 2) {
    if (arr[0] === 'applyCell' && arr[1] === 'applyTotal') {
      return (
        !(cell.columnType == 'GT' || cell.rowType == 'GT')
      );
    } else if (arr[0] === 'applyCell' && arr[1] === 'applyGrandTotal') {
      // total, GrandTotal 겹치는 곳 적용.
      if (cell.columnType == 'T' && cell.rowType == 'GT') {
        return true;
      } else if (cell.columnType == 'GT' && cell.rowType == 'T') {
        return true;
      } else {
        return (
          !(cell.columnType == 'T' || cell.rowType == 'T')
        );
      }
    } else {
      return (
        !(cell.columnType == 'D' && cell.rowType == 'D')
      );
    }
  // 전부 적용
  } else if (area === 'data' && arr.length == 3) {
    return true;
  }
};

// 홈앤쇼핑 커스터마이징
// 변동측정값 서식 적용
export const addStyleVariationValue = (formData, cell) => {
  const colorStyle = {
    // 배경색 추가 시 사용
    // 'background-color': '',
    'color': ''
  };
  const newFormData = formData;

  if (newFormData.variationValueType === 'percentVariation' ||
    newFormData.variationValueType === 'absoluteVariation'
  ) {
    newFormData.prefix = '+';
    colorStyle.color = '#0000ff';
    if (cell.value < 0) {
      cell.value = parseFloat(cell.value.toString().substring(1));
      newFormData.prefix = '△';
      colorStyle.color = '#ff0000';
    };
  }

  return {newFormData, colorStyle};
};

// 이모지 및 배경, 글자색 적용 함수.
export const getCssStyle = (highlight, cellElement, cell) => {
  // 이모지 적용.
  const applyEmoji = () => {
    if (highlight.emojiList >= 0) {
      cellElement.innerHTML =
        '<img src='+
          EmojiArr[highlight.emojiList].icon +
        ' style="float:left" />'+
        '<span>' + cellElement.innerText + '</span>';
    }
  };

  // 배경 및 글자색 적용.
  const colorStyle = {
    'background-color': highlight.backgroundColor,
    'color': highlight.fontColor
  };

  const checkCondition = (condition, valueFrom, valueTo, cellValue) => {
    switch (condition) {
      case '>': return Number(valueFrom) < cellValue;
      case '>=': return Number(valueFrom) <= cellValue;
      case '<': return Number(valueFrom) > cellValue;
      case '<=': return Number(valueFrom) >= cellValue;
      case '<>': return Number(valueFrom) != cellValue;
      case '=': return Number(valueFrom) == cellValue;
      case 'Between':
        return Number(valueFrom) < cellValue && cellValue < Number(valueTo);
      default: return false;
    }
  };

  // 조건 형식 추가.
  const cellIdx = cell.dataIndex;
  const condition = highlight.condition;
  const valueFrom = highlight.valueFrom;
  const valueTo = highlight.valueTo;
  const cellValue = cell.value;

  if (highlight.idx == cellIdx && highlight.type == 'measure' &&
    checkCondition(condition, valueFrom, valueTo, cellValue)
  ) {
    if (cellElement) {
      applyEmoji();
    }
    return {...colorStyle, 'white-space': 'normal'};
  } else if (highlight.type == 'dimension') {
    return colorStyle;
  }
};
