const IsDataCell = (cell, area, highlight) => {
  const arr = [];
  const map = new Map();
  if (highlight.applyCell) {
    map.set('applyCell', {'D': true});
    arr.push('applyCell');
  }
  if (highlight.applyTotal) {
    map.set('applyTotal', {'T': true});
    arr.push('applyTotal');
  }
  if (highlight.applyGrandTotal) {
    map.set('applyGrandTotal', {'GT': true});
    arr.push('applyGrandTotal');
  }

  if (area === 'data' && arr.length == 1) { // Type 하나만 선택 시.
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
  } else if (area === 'data' && arr.length == 2) { // 없는 Type 찾기.
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
  } else if (area === 'data' && arr.length == 3) { // 전부 적용
    return true;
  }
};
export default IsDataCell;
