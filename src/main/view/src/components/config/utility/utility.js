export const handleRowClick = (data, setRow) => {
  setRow(_.cloneDeep(data));
};
