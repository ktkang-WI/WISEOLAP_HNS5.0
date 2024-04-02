export const autoCoulumnNumber =
(columnSize, width, columnWidth) => {
  const defaultColumnSize =
    [...Array(columnSize).keys()].map((item) => item + 1);
  const returnColumnNumber = defaultColumnSize[Math.floor(width / columnWidth)];
  return returnColumnNumber || columnSize;
};
