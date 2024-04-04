export const splitRowsByColumnNumber = (dataSource, columnNumber) => {
  const length = dataSource.length;
  const result = [];
  let temp = [];

  for (let index = 1; index <= length; index++) {
    const isThisLastColumn = (index % columnNumber) == 0;

    temp.push(dataSource[index - 1]);

    if (isThisLastColumn) {
      result.push(temp);
      temp = [];
    }
    if (index === length) {
      if (temp.length > 0) {
        result.push(temp);
        temp = [];
      }
    }
  };
  return result;
};
